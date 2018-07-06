[![Build Status](https://travis-ci.org/faksam/Maintenance-Tracker-App.svg?branch=develop)](https://travis-ci.org/faksam/Maintenance-Tracker-App) [![Coverage Status](https://coveralls.io/repos/github/faksam/Maintenance-Tracker-App/badge.svg?branch=develop)](https://coveralls.io/github/faksam/Maintenance-Tracker-App?branch=develop) [![Maintainability](https://api.codeclimate.com/v1/badges/bd6af380f6d4c687f483/maintainability)](https://codeclimate.com/github/faksam/Maintenance-Tracker-App/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/bd6af380f6d4c687f483/test_coverage)](https://codeclimate.com/github/faksam/Maintenance-Tracker-App/test_coverage)

# Maintenance-Tracker-App
Maintenance Tracker App is an application that provides users with the ability to reach out to operations or repairs department regarding repair or maintenance requests and monitor the status of their request.

## Table of Content

 * [Getting Started](#getting-started)
 * [Technologies Used](#technologies-used)
 * [Installation](#installation)
 * [Testing](#testing)
 * [Features](#features)
 * [API Documentation](#api-documentation)
 * [Questions](#questions)
 * [License](#license)

## Getting Started
This is a javascript application written in [**ECMASCRIPT 6**](https://en.wikipedia.org/wiki/ECMAScript) and built with [**Express**](https://expressjs.com/) framework on the [**NodeJS**](https://nodejs.org/en/) platform.
Codes are written in accordance with [Airbnb](https://github.com/airbnb/javascript) JavaScript style guide.
Authentication of users is done via [**JSON Web Tokens**](https://jwt.io/).

## Technologies Used

**UI & Templates**
1. HTML & CSS
2. Javascript
3. JQuery

**Server Side**
1. NodeJS
2. Express
3. PostgreSql

**Client Side**
1. Javascript

### Dependencies
* Postgres
* Node

## Installation
1. Install [**Node JS**](https://nodejs.org/en/).
2. Install [**Postgres**](https://www.postgresql.org/).
3. Clone the [**repository here**](https://github.com/faksam/Maintenance-Tracker-App.git)
4. [**cd**] into the root of the **project directory**.
5. Run `npm install` on the terminal to install Dependecies
6. Create Postgresql database, Navigate to server directory and run migrations:
```
cd server
npm run migrations 
npm run seeders
```
7. Create a `.env` file in the root directory of the application. Use a different database for your testing and development. Example of the content of a .env file is shown in the .env.sample

8. Start the application:
**_Different Build Environment_**

**Production**
```
npm start
```
**Development**
```
npm run dev
```

## Testing

Sever side tests - Run `npm test` on the terminal while within the **project root directory**.

Server side testing is achieved through use of `chai-http`, `mocha` and `chai` packages. `chai-http` is used to make requests to the api and `mocha` is the testing framework and `chai` is the exception library. They will both be installed when you run `npm install` and the tests will run when you run `npm test`.

## Features
Maintenance-Tracker-App consists of the following features:

### Authentication

- It uses JSON Web Token (JWT) for authentication.
- Token is generated on user login or when a new user signup
- Token is perpetually verified to check the state of the user if logged in or not.
- Admin User will br pre-seeded into the application with administrative priviledges

### Unauthenticated Users
- Unauthenticated Users can view the landing and see how the app works
- Unauthenticated Users can register

### Authenticated Users
- Authenticated Users can log in
- Authenticated Users can create a new request
- Authenticated Users can view all their requests
- Authenticated Users can view a specific request
- Authenticated Users can delete a specific request
- Authenticated Users can view their account details
- Authenticated Users can edit their account details


### Admin Users
- Admins can view all requests
- Admins can approve a new/pending/disapproved request
- Admins can disapprove a new/pending/ request
- Admins can resolve a pending/disapproved request


## API Documentation
You can view the API Documentation [here](https://maintenancetracker.docs.apiary.io/)

### Questions
For more details contact contact@fakunlesamuel.com

## License
This project is authored by **Samuel Fakunle** (contact@fakunlesamuel.com) and is licensed for your use, modification and distribution under the **MIT** license.
[MIT][license] © [Samuel Fakunle](https://github.com/faksam)
<!-- Definitions -->
[license]: LICENSE

