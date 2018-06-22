/**
 * @description - Validate Signin Input
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const validateSignInInput = (req, res, next) => {
  const error = {};
  error.message = {};
  let errorChecker = false;

  req.sanitizeBody('password').trim();
  req.sanitizeBody('email').trim();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('email', 'Email must be a valid email').isEmail();

  // check the validation object for errors
  const errors = req.validationErrors();
  if (errors) {
    errorChecker = true;
    errors.forEach((value) => {
      error.message[value.param] = value.msg;
    });
  }

  if (errorChecker) {
    return res.status(400).send({
      success: false,
      status: 400,
      error,
    });
  } return next();
};

export default validateSignInInput;
