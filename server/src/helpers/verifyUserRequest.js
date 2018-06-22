/**
 * Check if parameter is integer
 *
 * @param {*} n the id parameter passed with HTTP request
 * @returns {boolean} Is the parameter an integer
 */
const isInt = n => n === parseInt(n, 10);

/**
 * @description - Verify User Request
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const verifyUserRequest = (req, res, next) => {
  const error = {};
  error.message = {};
  const requestId = parseInt(req.params.id, 10);
  if (requestId < 0 || !isInt(requestId)) {
    error.message = 'id parameter must be a valid integer number';
    return res.status(400).send({
      success: false,
      status: 400,
      error,
    });
  }
  return next();
};

export default verifyUserRequest;

