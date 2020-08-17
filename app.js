'use strict';

const express = require('express');
const basicAuthentication = require('./basic-authentication');
const { validate, ValidationError, Joi } = require('express-validation');
const ReviewRepository = require('./review-repository');
const Review = require('./review');

const realm = 'Guestbook';

const users = {
  john: 'john',
  george: 'george',
  stephen: 'stephen'
};
const admins = {
  admin: 'admin'
}
const oneOf = function(users) {
  return function(username, password) {
    if (username in users) {
      return users[username] === password;
    }
    else {
      return false;
    }
  };
}
const userAuthorized = basicAuthentication({
  realm,
  authenticate: oneOf(users)
});
const adminAuthorized = basicAuthentication({
  realm,
  authenticate: oneOf(admins)
});

function createApp(options = {}) {
  const app = express();
  const reviewRepository = options.reviewRepository || new ReviewRepository();

  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Welcome to our Guest book!');
  });

  const submitValidation = validate({
    body: Joi.object({
      authorName: Joi.string().required().min(3), // like 'Max'
      body: Joi.string().required().min(2) // like 'OK'
    })
  });
  app.post('/submit', userAuthorized, submitValidation, async (req, res) => {
    let review = new Review(req.body.authorName, req.body.body);
    await reviewRepository.save(review);
    res.sendStatus(200);
  });

  const feedbackValidation = validate({
    query: Joi.object({
      fromDate: Joi.date().optional(),
      toDate: Joi.date().optional(),
      byName: Joi.string().optional()
    })
  });
  app.get('/feedback', adminAuthorized, feedbackValidation, async (req, res) => {
    let criteria = {};
    if (req.query.fromDate != null) {
      criteria.fromDate = new Date(req.query.fromDate);
    }
    if (req.query.toDate != null) {
      criteria.toDate = new Date(req.query.toDate);
    }
    if (req.query.byName != null) {
      criteria.byName = req.query.byName;
    }
    let reviews = await reviewRepository.find(criteria);
    res.json(reviews);
  });

  app.use(function(err, req, res, next) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err);
    }
    else {
      return res.status(500).json(err);
    }
  });
  
  return app;
}

module.exports = createApp;
