'use strict';

const { promises: fs } = require('fs');
const path = require('path');

const defaultFileName = './reviews.json';

function all() {
  return (review) => true;
}
function and(functionA, functionB) {
  return (review) => functionA(review) && functionB(review);
}
function fromDate(date) {
  return (review) => review.dateCreated.getTime() >= date.getTime();
}
function toDate(date) {
  return (review) => review.dateCreated.getTime() <= date.getTime();
}
function byName(name) {
  return (review) => review.authorName === name;
}


class ReviewRepository {

  constructor(fileName = defaultFileName) {
    this.fileName = path.resolve(fileName);
  }

  async findAll() {
    try {
      let fileContent = await fs.readFile(this.fileName, {encoding:'utf-8'});
      return JSON.parse(fileContent, function(key, value) {
        if (key === 'dateCreated') {
          return new Date(value);
        }
        else {
          return value;
        }
      });
    }
    catch (err) {
      return [];
    }
  }

  async find(criteria) {
    let filter = all();
    if (criteria.fromDate !== undefined) {
      filter = and(filter, fromDate(criteria.fromDate));
    }
    if (criteria.toDate !== undefined) {
      filter = and(filter, toDate(criteria.toDate));
    }
    if (criteria.byName !== undefined) {
      filter = and(filter, byName(criteria.byName));
    }
    return (await this.findAll()).filter(filter);
  }

  async save(review) {
    let reviewsData = await this.findAll();
    reviewsData.push(review);
    try {
      await fs.writeFile(this.fileName, JSON.stringify(reviewsData));
    }
    catch (err) {
      console.log('cannot write to ' + this.fileName);
      throw err;
    }
  }

  async deleteAll() {
    try {
      await fs.unlink(this.fileName);
    }
    catch (err) {
      // pokemon catch
    }
  }
};

module.exports = ReviewRepository;