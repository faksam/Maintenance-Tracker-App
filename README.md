# Maintenance-Tracker-App
Maintenance Tracker App is an application that provides users with the ability to reach out to operations or repairs department regarding repair or maintenance requests and monitor the status of their request.

[![Build Status](https://travis-ci.org/faksam/Maintenance-Tracker-App.svg?branch=develop)](https://travis-ci.org/faksam/Maintenance-Tracker-App) [![Coverage Status](https://coveralls.io/repos/github/faksam/Maintenance-Tracker-App/badge.svg?branch=develop)](https://coveralls.io/github/faksam/Maintenance-Tracker-App?branch=develop) [![Maintainability](https://api.codeclimate.com/v1/badges/bd6af380f6d4c687f483/maintainability)](https://codeclimate.com/github/faksam/Maintenance-Tracker-App/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/bd6af380f6d4c687f483/test_coverage)](https://codeclimate.com/github/faksam/Maintenance-Tracker-App/test_coverage)

<b> View UI Template Here: </b> https://faksam.github.io/Maintenance-Tracker-App/UI/ <br>
 <br/><b> Test API Endpoint Here: </b> https://maintenancetracker.herokuapp.com/api/v1
 <br/><b> View API Documentation Here: </b> maintenancetracker.docs.apiary.io

## Table of Content

 * [Features](#features)
 * [Technologies](#technologies)
 * [Installation](#installation)
 * [Testing](#testing)
 * [API Routes](#api-routes)
 * [License](#license)

## Features
Below are the features of the Maintenance-Tracker-App 
####  Users
* Users can signup and signin.
* #### Admin
    * Get all requests
    * Approve a request
    * Disapprove a request
    * Resolve a request
* #### Regular User's
    * Get all request by that user,
    * Create requests, 
    * Get a specific request (created by that user), 
    * Update a specific  requests  to view polls and vote in them.

## Technologies used

Modern JavaScript technologies were adopted for this project

ES2015: Also known as ES6 or ES2015 or ECMASCRIPT 6, is a new and widely used version of Javascript
that makes it compete healthily with other languages. See [here](https://en.wikipedia.org/wiki/ECMAScript) for more infromation.

NodeJS: Node.js is an open-source, cross-platform JavaScript run-time environment which allows you enjoy the features of Javascript off the web browsers and implement server-side web development.
Visit [here](https://nodejs.org/en/) for more information.

ExressJS: This is the web application framework for Node.js
Visit [here](https://expressjs.com) for more information

Codes are written in accordance with Airbnb JavaScript style guide, see [here](https://github.com/airbnb/javascript) for details.

## Installation
1. Clone this repository into your local machine:

`git clone https://github.com/faksam/Maintenance-Tracker-App.git`

2. Install dependencies

`npm install`

3. Start the application by running

`npm start`

4. Open your browse and Navigate to

`localhost:3456`

5. Install postman to test all endpoints

## Testing

- run test using `npm run test`    

## API Routes

<table>

<tr><th>HTTP VERB</th><th>ENDPOINT</th><th>FUNCTIONALITY</th></tr>

<tr><td>POST</td> <td>api/v1/auth/signup</td>  <td>Register a user</td></tr>
<tr><td>POST</td> <td>api/v1/auth/login</td>  <td>Login a user</td></tr>

<tr><td>GET</td> <td>api/v1/users/requests </td> <td>Fetch all the requests of a logged in user</td></tr>
<tr><td>GET</td> <td>api/v1/users/requests/:requestId </td> <td>Fetch a request that belongs to a logged in user</td></tr>
<tr><td>POST</td> <td>api/v1/users/requests</td>  <td>Create a request.</td></tr>
<tr><td>PUT</td> <td>api/v1/users/requests/:requestId</td>  <td>Modify a request.</td></tr>

<tr><td>GET</td> <td>api/v1/requests/ </td> <td>Fetch all the requests.</td></tr>
<tr><td>PUT</td> <td>api/v1/requests/:requestId/approve</td> <td>Approve request </td></tr>
<tr><td>PUT</td> <td>api/v1/requests/:requestId/disapprove</td> <td>Disapprove request </td></tr>
<tr><td>PUT</td> <td>api/v1/requests/:requestId/resolve</td> <td>Resolve request </td></tr>

</table>

## License
MIT License

Copyright (c) 2018 Fakunle Mayowa Samuel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


