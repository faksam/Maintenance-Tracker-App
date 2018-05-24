import usersController from '../../controllers/usersController';
import { verifyRequestInput, verifyIfRequestExist, checkRequestStatus } from '../../helpers/validator';
import { authorizeUser } from '../../middleware/authorize';

module.exports = (app) => {
  app.get('/users/requests', authorizeUser, usersController.getRequests);
  app.get('/users/requests/:id', authorizeUser, verifyIfRequestExist, usersController.getRequest);
  app.post('/users/requests', authorizeUser, verifyRequestInput, usersController.postRequest);
  app.put('/users/requests/:id', authorizeUser, verifyIfRequestExist, checkRequestStatus, verifyRequestInput, usersController.updateRequest);
};
