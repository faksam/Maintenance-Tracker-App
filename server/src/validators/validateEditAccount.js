/**
 * @description - Validate Update User Account Input
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const validateEditAccount = (req, res, next) => {
  const error = {};
  error.message = {};

  req.sanitizeBody('fullName').trim();
  req.sanitizeBody('email').trim();

  req.checkBody('fullName', 'Full Name must be between 3-40 characters').notEmpty().trim().isLength({ min: 3, max: 40 })
    .isString();
  req.checkBody('email', 'Email must be a valid email').isEmail().trim();

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

export default validateEditAccount;

