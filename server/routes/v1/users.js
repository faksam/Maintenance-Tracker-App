import usersController from '../../controllers/usersController';
import { verifyRequestInput, verifyUserToken, verifyUserRequest, checkIfUserRequestExist, checkRequestStatus } from '../../helpers/validator';
import { authorizeUser } from '../../middleware/authorize';
import { checkDuplicateRequest, validateUpdateAccountInput } from '../../helpers/userValidator';

export default (app) => {
  app.get('/users/account', verifyUserToken, authorizeUser, usersController.getUserDetails);
  app.put('/users/account', verifyUserToken, authorizeUser, validateUpdateAccountInput, usersController.updateUserDetails);
  app.get('/users/requests', verifyUserToken, authorizeUser, usersController.getRequests);
  app.get('/users/requests/:id', verifyUserToken, authorizeUser, verifyUserRequest, checkIfUserRequestExist, usersController.getRequest);
  app.post('/users/requests', verifyUserToken, authorizeUser, verifyRequestInput, checkDuplicateRequest, usersController.postRequest);
  app.put('/users/requests/:id', verifyUserToken, authorizeUser, verifyUserRequest, checkIfUserRequestExist, checkRequestStatus, verifyRequestInput, usersController.updateRequest);
};
