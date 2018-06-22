import jwt from 'jwt-simple';

/**
 * Decode user token if token is valid
 *
 * @param {*} userToken the token parameter passed with HTTP request.headers.authorization
 * @returns {boolean||object} false if token is invalid and token object if token is valid
 */
export const decodeToken = (userToken) => {
  const error = {};
  error.message = {};
  let decode = '';
  const authHeader = userToken.split(' ');
  decode = jwt.decode(authHeader[1], process.env.SECRET_TOKEN);
  return decode;
};

/**
 * @description - Verify User Token
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const verifyUserToken = (req, res, next) => {
  const error = {};
  error.message = {};
  let decode = '';
  if (req.headers.authorization === undefined || req.headers.authorization === '') {
    error.message = 'Token not valid';
    return res.status(400).send({
      success: false,
      status: 400,
      error,
    });
  } else if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const authHeader = req.headers.authorization.split(' ');
    try {
      decode = jwt.decode(authHeader[1], process.env.SECRET_TOKEN);
    } catch (err) {
      error.message = err;
    }
  }
  if (decode === '') {
    error.message = 'Token not valid';
    return res.status(400).send({
      success: false,
      status: 400,
      error,
    });
  }
  return next();
};
