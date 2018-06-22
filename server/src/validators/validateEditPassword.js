/**
 * @description - Validate Update User Password Input
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const validateEditPassword = (req, res, next) => {
  const error = {};
  error.message = {};

  req.sanitizeBody('password').trim();
  req.sanitizeBody('newPassword').trim();
  req.sanitizeBody('confirmNewPassword').trim();

  req.checkBody('password', 'Current Password usually between 8-20 characters').notEmpty().trim().isLength({ min: 8, max: 20 })
    .isString();
  req.checkBody('confirmNewPassword', 'Confirm New Password must be between 8-20 characters').notEmpty().trim().isLength({ min: 8, max: 20 })
    .isString();
  req.checkBody('newPassword', 'New Password Input & Confirm New Password must be equal between 8-20 characters').equals(req.body.confirmNewPassword);

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

export default validateEditPassword;

