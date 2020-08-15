const express = require('express');
const reviewRepository = require('./review-repository');
const Review = require('./review');
const app = express();
const port = 8080;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to our Guest book!');
})
app.post('/submit', async (req, res) => {
  let review = new Review(req.body.authorName, req.body.body);
  await reviewRepository.save(review);
  res.sendStatus(200);
});
app.get('/feedback', (req, res) => {
  let criteria = {
    fromDate: req.query.fromDate,
    toDate: req.query.toDate,
    byName: req.query.byName,
  };
  let reviews = reviewRepository.search(criteria);
  res.json(reviews);
});
reviewRepository.reloadFromFile()
  .then(() => {
    app.listen(port, () => console.log('app started'));
  });
