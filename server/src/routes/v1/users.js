import usersController from '../../controllers/usersController';
import { authorizeUser } from '../../middleware/authorize';
import { checkDuplicateRequest } from '../../helpers/checkDuplicateRequest';
import { verifyRequestInput } from '../../helpers/verifyRequestInput';
import { verifyUserRequest } from '../../helpers/verifyUserRequest';
import { checkIfUserRequestExist } from '../../helpers/checkIfUserRequestExist';
import { checkRequestStatus } from '../../helpers/checkRequestStatus';
import { countAllUsersRequests } from '../../helpers/countAllUsersRequests';
import { verifyUserToken } from '../../validators/tokenValidator';
import { validatePageQuery } from '../../validators/validatePageQuery';

export default (app) => {
  app.get('/users/requests/filter', verifyUserToken, authorizeUser, usersController.filterRequests);
  app.get('/users/requests', verifyUserToken, authorizeUser, validatePageQuery, countAllUsersRequests, usersController.getRequests);
  app.get('/users/requests/:id([0-9]+)', verifyUserToken, authorizeUser, verifyUserRequest, checkIfUserRequestExist, usersController.getRequest);
  app.post('/users/requests', verifyUserToken, authorizeUser, verifyRequestInput, checkDuplicateRequest, usersController.postRequest);
  app.put('/users/requests/:id([0-9]+)', verifyUserToken, authorizeUser, verifyUserRequest, checkIfUserRequestExist, checkRequestStatus, verifyRequestInput, usersController.updateRequest);
  app.delete('/users/requests/:id([0-9]+)', verifyUserToken, authorizeUser, verifyUserRequest, checkIfUserRequestExist, checkRequestStatus, usersController.deleteRequest);
};
