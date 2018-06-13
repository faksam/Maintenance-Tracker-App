import usersController from '../../controllers/usersController';
import { authorizeUser } from '../../middleware/authorize';
import { checkDuplicateRequest } from '../../helpers/userValidator';
import {
  verifyRequestInput,
  verifyUserToken,
  verifyUserRequest,
  checkIfUserRequestExist,
  checkRequestStatus,
  countAllUsersRequests,
  validatePageQuery,
} from '../../helpers/validator';

export default (app) => {
  app.get('/users/requests', verifyUserToken, authorizeUser, validatePageQuery, countAllUsersRequests, usersController.getRequests);
  app.get('/users/requests/:id([0-9]+)', verifyUserToken, authorizeUser, verifyUserRequest, checkIfUserRequestExist, usersController.getRequest);
  app.post('/users/requests', verifyUserToken, authorizeUser, verifyRequestInput, checkDuplicateRequest, usersController.postRequest);
  app.put('/users/requests/:id([0-9]+)', verifyUserToken, authorizeUser, verifyUserRequest, checkIfUserRequestExist, checkRequestStatus, verifyRequestInput, usersController.updateRequest);
};
