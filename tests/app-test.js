'use strict';

const { describe, it } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const ReviewRepository = require('../review-repository');
const createApp = require('../app');

const expect = chai.expect;
chai.use(chaiHttp);

const reviewRepository = new ReviewRepository('./tests/reviews.json');

const app = createApp({reviewRepository});

describe('app', function() {
  it('should allow access to everyone to /', async function() {
    let res = await chai.request(app)
      .get('/');
    expect(res).to.have.status(200);
  });
  it('should deny access to unauthorized users to /submit', async function() {
    let res = await chai.request(app)
      .post('/submit');
    expect(res).to.have.status(401);
  });
  it('should deny access to wrong credentials to /submit', async function() {
    let res = await chai.request(app)
      .post('/submit')
      .auth('john', 'jon')
      .send({
        authorName: 'john doe',
        body: 'good'
      });
    expect(res).to.have.status(401);
  });
  it('should allow access to authorized users to /submit', async function() {
    let res = await chai.request(app)
      .post('/submit')
      .auth('john', 'john')
      .send({
        authorName: 'john doe',
        body: 'good'
      });
    expect(res).to.have.status(200);
  });
  it('should complain about bad data to /submit', async function() {
    let res = await chai.request(app)
      .post('/submit')
      .auth('john', 'john')
      .send({
        authorName: 'jo'
      });
    expect(res).to.have.status(400);
  });
  it('should deny access to unauthorized users to /feedback', async function() {
    let res = await chai.request(app)
      .get('/feedback');
    expect(res).to.have.status(401);
  });
  it('should deny access to wrong credentials to /feedback', async function() {
    let res = await chai.request(app)
      .get('/feedback')
      .auth('admin', 'amin');
    expect(res).to.have.status(401);
  });
  it('should allow access to authorized admins to /feedback', async function() {
    let res = await chai.request(app)
      .get(`/feedback?fromDate=${new Date()}&toDate=${new Date()}&byName=john`)
      .auth('admin', 'admin');
    expect(res).to.have.status(200);
  });
  it('should complain about bad data to /feedback', async function() {
    let res = await chai.request(app)
      .get('/feedback?fromDate')
      .auth('admin', 'admin');
    expect(res).to.have.status(400);
  });
});
