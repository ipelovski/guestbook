'use strict';

const mocha = require('mocha');
const { expect } = require('chai');
const ReviewRepository = require('../review-repository');
const Review = require('../review');

const reviewRepository = new ReviewRepository('./tests/reviews.json');

afterEach(async function() {
  await reviewRepository.deleteAll();
});
describe('review repository', function() {
  it('should save a new review', async function() {
    let review = new Review('john doe', 'good');
    await reviewRepository.save(review);
    let reviews = await reviewRepository.findAll();
    expect(reviews).to.have.length(1);
    expect(reviews[0]).to.haveOwnProperty('body', 'good');
  });
  it('should find all reviews', async function() {
    let review = new Review('john doe', 'good');
    await reviewRepository.save(review);
    let review2 = new Review('george smith', 'nice');
    await reviewRepository.save(review2);
    let reviews = await reviewRepository.findAll();
    expect(reviews).to.have.length(2);
    expect(reviews[0].authorName).not.to.equals(reviews[1].authorName);
  });
  it('should find reviews from specific date', async function() {
    let review = new Review('john doe', 'good');
    await reviewRepository.save(review);
    await new Promise((resolve) => setTimeout(resolve, 1));
    let review2 = new Review('george smith', 'nice');
    await reviewRepository.save(review2);
    let reviews = await reviewRepository.find({
      fromDate: review2.dateCreated
    });
    expect(reviews).to.have.length(1);
    expect(reviews[0]).to.haveOwnProperty('body', 'nice');
  });
  it('should find reviews to specific date', async function() {
    let review = new Review('john doe', 'good');
    await reviewRepository.save(review);
    await new Promise((resolve) => setTimeout(resolve, 1));
    let review2 = new Review('george smith', 'nice');
    await reviewRepository.save(review2);
    let reviews = await reviewRepository.find({
      toDate: review.dateCreated
    });
    expect(reviews).to.have.length(1);
    expect(reviews[0]).to.haveOwnProperty('body', 'good');
  });
  it('should find reviews by author name', async function() {
    let review = new Review('john doe', 'good');
    await reviewRepository.save(review);
    let review2 = new Review('george smith', 'nice');
    await reviewRepository.save(review2);
    let reviews = await reviewRepository.find({
      byName: review2.authorName
    });
    expect(reviews).to.have.length(1);
    expect(reviews[0]).to.haveOwnProperty('body', 'nice');
  });
  it('should find reviews by author name, from date, and to date', async function() {
    let review = new Review('john doe', 'good');
    await reviewRepository.save(review);
    await new Promise((resolve) => setTimeout(resolve, 1));
    let review2 = new Review('george smith', 'nice');
    await reviewRepository.save(review2);
    let reviews = await reviewRepository.find({
      fromDate: review2.dateCreated,
      toDate: review2.dateCreated,
      byName: review2.authorName
    });
    expect(reviews).to.have.length(1);
    expect(reviews[0]).to.haveOwnProperty('body', 'nice');
  });
  it('should delete all', async function() {
    let review = new Review('john doe', 'good');
    await reviewRepository.save(review);
    let review2 = new Review('george smith', 'nice');
    await reviewRepository.save(review2);
    await reviewRepository.deleteAll();
    let reviews = await reviewRepository.findAll();
    expect(reviews).to.have.length(0);
  });
});
