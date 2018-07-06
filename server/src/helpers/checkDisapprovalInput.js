/**
 * @description - Check Reject/Disapprove Input
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const checkDisapprovalInput = (req, res, next) => {
    const error = {};
    error.message = {};
    const errorChecker = false;
  
    req.checkBody('comment', 'Input must be between 20-500 characters.').notEmpty().isLength({ min: 20, max: 500 }).isString();
  
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
  
  export default checkDisapprovalInput;
  