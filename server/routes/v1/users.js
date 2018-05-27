import usersController from '../../controllers/usersController';
import { verifyRequestInput, verifyUserRequest, checkRequestStatus } from '../../helpers/validator';
import { authorizeUser } from '../../middleware/authorize';

module.exports = (app) => {
  app.get('/users/requests', authorizeUser, usersController.getRequests);
  app.get('/users/requests/:id', authorizeUser, verifyUserRequest, usersController.getRequest);
  app.post('/users/requests', authorizeUser, verifyRequestInput, usersController.postRequest);
  app.put('/users/requests/:id', authorizeUser, verifyUserRequest, checkRequestStatus, verifyRequestInput, usersController.updateRequest);
};
