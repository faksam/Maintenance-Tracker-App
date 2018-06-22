
/**
 * @description - Validate Signup Input
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const validateSignUpInput = (req, res, next) => {
  const error = {};
  error.message = {};

  req.sanitizeBody('fullName').trim();
  req.sanitizeBody('confirmPassword').trim();
  req.sanitizeBody('password').trim();
  req.sanitizeBody('email').trim();

  req.checkBody('fullName', 'Full Name must be between 3-40 characters').trim().isLength({ min: 3, max: 40 })
    .isString();
  req.checkBody('password', 'Password must be between 8-20 characters').trim().isLength({ min: 8, max: 20 })
    .isString();
  req.checkBody('confirmPassword', 'Password & Confirm Password must be equal').equals(req.body.password);
  req.checkBody('email', 'Email must be a valid email').isEmail();

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

export default validateSignUpInput;

