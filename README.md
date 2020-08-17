# guestbook

A sample application for writing user reviews and searching them.

Install with `npm install`
Run with `npm start`

Starting point: index.js
Defining express app and routes: app.js
Basic authentication middleware: basic-authentication.js
Review class: review.js
Service for persisting reviews: review-repository.js
Tests: tests/*.js

##### Submitting a new review
curl -i -X POST -H 'Content-Type: application/json' -d '{"authorName":"john doe","body":"very nice"}' http://localhost:8080/submit -u john:john

##### Getting all reviews
curl -i -X GET http://localhost:8080/feedback -u admin:admin

##### Getting specific reviews
curl -i -X GET 'http://localhost:8080/feedback?fromDate=2020-08-17T09:16:14.079Z' -u admin:admin