// import json file
import usersRequest from '../db/usersRequest.json';

export const verifyRequestInput = (req, res, next) => {
  const {
    title, description,
  } = req.body;

  const errors = req.validationErrors();
  req.checkBody('title', 'title is required').notEmpty();
  req.checkBody('description', 'description is required').notEmpty();

  if (errors) {
    return res.status(400).send({ errors });
  }

  let errorChecker = false;
  const error = {};

  if (title === '' || title == null) {
    errorChecker = true;
    error.date = 'Title is required!';
  }
  if (description === '' || description == null) {
    errorChecker = true;
    error.date = 'Description is required!';
  }

  if (!errorChecker) { return next(); }

  return res.status(400).json({ error });
};

export const verifyIfRequestExist = (req, res, next) => {
  let requestChecker = false;
  usersRequest.requests.forEach((element) => {
    if (element.id === req.params.id) {
      requestChecker = true;
    }
    return next();
  });
  if (!requestChecker) {
    res.status(404).send(usersRequest);
  }
};
