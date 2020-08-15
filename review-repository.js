const { promises: fs } = require('fs');

const fileName = './reviews.json';

//let reviews = fs.readFileSync('')
let reviewsData = [];

function all() {
  return (review) => true;
}
function and(functionA, functionB) {
  return (review) => functionA(review) && functionB(review);
}
function fromDate(date) {
  return (review) => review.dateCreated >= date;
}
function toDate(date) {
  return (review) => review.dateCreated <= date;
}
function byName(name) {
  return (review) => review.authorName === name;
}


const reviewRepository = {
  async reloadFromFile() {
    try {
      let fileContent = await fs.readFile(fileName, {encoding:'utf-8'});
      reviewsData = JSON.parse(fileContent);
    }
    catch (err) {
      reviewsData = [];
    }
  },
  async save(review) {
    reviewsData.push(review);
    try {
      await fs.writeFile(fileName, JSON.stringify(reviewsData));
    }
    catch (err) {
      console.log('cannot write to ' + fileName);
    }
  },
  search(criteria) {
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
    return reviewsData.filter(filter);
  }
};

module.exports = reviewRepository;