import usersController from '../../controllers/usersController';
import { verifyRequestInput, verifyIfRequestExist, checkRequestStatus } from '../../helpers/validator';

module.exports = (app) => {
  app.get('/users/requests', usersController.getRequests);
  app.get('/users/requests/:id', verifyIfRequestExist, usersController.getRequest);
  app.post('/users/requests', verifyRequestInput, usersController.postRequest);
  app.put('/users/requests/:id', verifyIfRequestExist, checkRequestStatus, verifyRequestInput, usersController.updateRequest);
};
