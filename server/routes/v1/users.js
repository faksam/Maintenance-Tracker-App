import usersCtrl from '../../controllers/usersController';
import { verifyRequestInput, verifyIfRequestExist } from '../../helpers/validator';

module.exports = (app) => {
  app.get('/users/requests', usersCtrl.getRequests);
  app.get('/users/requests/:id', verifyIfRequestExist, usersCtrl.getRequest);
  app.post('/users/requests', verifyRequestInput, usersCtrl.postRequest);
  app.put('/users/requests/:id', verifyIfRequestExist, verifyRequestInput, usersCtrl.updateRequest);
};
