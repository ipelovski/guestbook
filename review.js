'use strict';

module.exports = class Review {
  constructor(authorName, body) {
    this.authorName = authorName;
    this.body = body;
    this.dateCreated = new Date();
  }
};
