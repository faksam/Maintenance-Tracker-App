/**
 * Check if parameter is integer
 *
 * @param {*} n the id parameter passed with HTTP request
 * @returns {boolean} Is the parameter an integer
 */
const isInt = n => n === parseInt(n, 10);

/**
 * @description - Validate Request Query Parameters
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const validatePageQuery = (req, res, next) => {
  const error = {};
  error.message = {};
  if (req.query.page !== undefined) {
    const page = parseInt(req.query.page, 10);
    if (!isInt(page) || page < 1) {
      error.message = 'Invalid Page Query';
      return res.status(400).send({
        success: false,
        status: 400,
        error,
      });
    }
  }

  return next();
};

export default validatePageQuery;
