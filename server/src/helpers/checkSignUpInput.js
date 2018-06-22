/**
 * @description - Validate Signup Input
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const checkSignUpInput = (req, res, next) => {
  const error = {};
  error.message = {};

  req.sanitizeBody('fullName').trim();
  req.sanitizeBody('confirmPassword').trim();
  req.sanitizeBody('password').trim();
  req.sanitizeBody('email').trim();

  req.checkBody('fullName', 'Full Name is required.').notEmpty();
  req.checkBody('confirmPassword', 'Confirm assword is required.').notEmpty();
  req.checkBody('password', 'Password is required.').notEmpty();
  req.checkBody('email', 'Email is required.').notEmpty();


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

  return next();
};

export default checkSignUpInput;

