import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV;
let connectionString;

if (env === 'development') {
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = process.env.use_env_variable;
}

const pool = new Pool({
  connectionString,
});

export const verrifyUserExist = (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const queryValues = [];
  const error = {};
  let errorChecker = false;

  queryValues.push(email);

  pool.query('SELECT * FROM users WHERE email = $1', [queryValues[0]], (err, result) => {
    if (err) {
      errorChecker = true;
      error.err = err;
    }
    if (result.rows.length > 0) {
      errorChecker = true;
      error.user = 'This email/user already exist in our server, try signing in.';
    }
    if (errorChecker) {
      return res.status(409).send({
        success: false,
        status: 409,
        error
      });
    }
    return next();
  });
};


// export const verrifyUserCanSignIn = (req, res, next) => {
//   const email  = req.body.email;
//   // // validate the input
//   req.checkBody('email', 'Email is required').notEmpty();
//   req.checkBody('email', 'Email does not appear to be valid').isEmail();

//   // check the validation object for errors
//   let errors = req.validationErrors();

//   console.log(errors);

//   if (errors) {
//     return res.status(400).send({errors})
//   }

//   const error = {};
//   User.findAll({
//     where: {
//       email: email
//     }
//   })
//     .then((user) => {
//       if (user.length > 0) {
//         return next();
//       }
//       error.user = 'User does not exist please sign up';

//         return res.status(404).json({ error });
//     });
// };

export const validateSignUpInput = (req, res, next) => {
  const {
    fullName, email, phoneNo, password
  } = req.body;
  const error = {};
  error.message = {};
  req.checkBody('fullName', 'Full Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('phoneNo', 'Phone No is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('email', 'Email does not appear to be valid').isEmail();

  // check the validation object for errors
  const errors = req.validationErrors();
  if (errors) {
    errors.forEach((value) => {
      error.message[value.param] = value.msg;
    });
    return res.status(400).send({
      success: false,
      status: 400,
      error,
    });
  }

  let errorChecker = false;

  if (fullName === '' || fullName === null || fullName === undefined) {
    errorChecker = true;
    error.fullName = 'Full name field is required';
  }
  if (email === '' || email === null || email === undefined) {
    errorChecker = true;
    error.description = 'Email field is required';
  }
  if (phoneNo === '' || phoneNo === null || phoneNo === undefined) {
    errorChecker = true;
    error.description = 'Phone no - field is required';
  }
  if (password === '' || password === null || password === undefined) {
    errorChecker = true;
    error.status = 'Password field is required';
  }

  if (!errorChecker) { return next(); }

  return res.status(400).send({
    success: false,
    status: 400,
    error,
  });
};


// export const verifySignInInput = (req, res, next) => {
// //   const {
// //     email, password
// //   } = req.body;

// //   req.checkBody('email', 'Email is required').notEmpty();
// //   req.checkBody('password', 'Password is required').notEmpty();
// //   req.checkBody('email', 'Email does not appear to be valid').isEmail();

// //   // check the validation object for errors
// //   const errors = req.validationErrors();

// //   if (errors) {
// //     return res.status(400).send({ errors });
// //   }

// //   let errorChecker = false;
// //   const error = {};

// //   if (email === '' || email == null || email == undefined) {
// //     errorChecker = true;
// //     error.description = 'Email field is required';
// //   }
// //   if (password === '' || password == null || password == undefined) {
// //     errorChecker = true;
// //     error.status = 'Password field is required';
// //   }

// //   if (!errorChecker) { return next(); }

// //   return res.status(400).json({ error });
// // };

// // export const findUserById = (userId) => {
// //   return User
// //     .findAll({
// //       where: {
// //         id: userId
// //       }
// //     })
// //     .then(user => res.status(201).send({ user: user[0] }))
// //     .catch(error => res.status(404).send({ error }));
// };

