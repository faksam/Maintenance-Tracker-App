/**
 * @description - Verify Request Input
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const verifyRequestInput = (req, res, next) => {
  const error = {};
  error.message = {};
  const errorChecker = false;

  req.sanitizeBody('title').trim();
  req.sanitizeBody('description').trim();
  req.checkBody('title', 'Title must be between 5-50 characters').notEmpty().isLength({ min: 5, max: 50 }).isString();
  req.checkBody('description', 'Description must be between 20-500 characters').notEmpty().isLength({ min: 20, max: 500 }).isString();

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

  if (errorChecker) {
    return res.status(400).send({
      success: false,
      status: 400,
      error,
    });
  }

  return next();
};

export default verifyRequestInput;
