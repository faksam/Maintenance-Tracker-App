// import json file
import usersRequest from '../db/usersRequest.json';

export const verifyRequestInput = (req, res, next) => {
  req.checkBody('title', 'title is required').notEmpty();
  req.checkBody('description', 'description is required').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).send({ errors });
  }

  return next();
};

export const verifyIfRequestExist = (req, res, next) => {
  /**
   * Check if parameter is integer
   *
   * @param {*} n the id parameter passed with HTTP request
   * @returns {boolean} Is the parameter an integer
   */
  function isInt(n) {
    return n === parseInt(n, 10);
  }
  const requestId = parseInt(req.params.id, 10);
  let requestChecker = false;
  if (requestId < 0 || !isInt(requestId)) {
    // either age was not a valid number, integer, or is not in range
    return res.status(400).send({ message: '"id parameter" must be a valid integer number' });
  }
  usersRequest.requests.forEach((element) => {
    if (element.id === requestId) {
      requestChecker = true;
      return next();
    }
  });
  if (!requestChecker) {
    res.status(404).send({ message: 'request id not found' });
  }
};
