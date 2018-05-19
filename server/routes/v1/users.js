import usersController from '../../controllers/usersController';
import { verifyRequestInput, verifyIfRequestExist } from '../../helpers/validator';

module.exports = (app) => {
  app.get('/users/requests', usersController.getRequests);
  app.get('/users/requests/:id', verifyIfRequestExist, usersController.getRequest);
  app.post('/users/requests', verifyRequestInput, usersController.postRequest);
  app.put('/users/requests/:id', verifyIfRequestExist, verifyRequestInput, usersController.updateRequest);
};
