import usersController from '../../controllers/usersController';
import { verifyRequestInput, verifyUserToken, verifyUserRequest, checkIfUserRequestExist, checkRequestStatus } from '../../helpers/validator';
import { authorizeUser } from '../../middleware/authorize';
import { checkDuplicateRequest } from '../../helpers/userValidator';

export default (app) => {
  app.get('/users/requests', verifyUserToken, authorizeUser, usersController.getRequests);
  app.get('/users/requests/:id', verifyUserToken, authorizeUser, verifyUserRequest, checkIfUserRequestExist, usersController.getRequest);
  app.post('/users/requests', verifyUserToken, authorizeUser, verifyRequestInput, checkDuplicateRequest, usersController.postRequest);
  app.put('/users/requests/:id', verifyUserToken, authorizeUser, verifyUserRequest, checkIfUserRequestExist, checkRequestStatus, verifyRequestInput, usersController.updateRequest);
};
