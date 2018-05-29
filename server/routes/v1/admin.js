import adminController from '../../controllers/adminController';
import { checkIfRequestExist, verifyUserToken, validateRequestID } from '../../helpers/validator';
import { authorizeAdmin } from '../../middleware/authorize';

module.exports = (app) => {
  app.get('/requests', verifyUserToken, authorizeAdmin, adminController.getRequests);
  app.put('/requests/:id/approve', verifyUserToken, authorizeAdmin, validateRequestID, checkIfRequestExist, adminController.approveRequest);
  app.put('/requests/:id/disapprove', verifyUserToken, authorizeAdmin, validateRequestID, checkIfRequestExist, adminController.rejectRequest);
  app.put('/requests/:id/resolve', verifyUserToken, authorizeAdmin, validateRequestID, checkIfRequestExist, adminController.resolveRequest);
};
