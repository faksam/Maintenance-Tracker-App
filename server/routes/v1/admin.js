import adminController from '../../controllers/adminController';
import { verifyIfRequestExist } from '../../helpers/validator';
import { authorizeAdmin } from '../../middleware/authorize';

module.exports = (app) => {
  app.get('/requests', authorizeAdmin, adminController.getRequests);
  app.put('/requests/:id/approve', authorizeAdmin, verifyIfRequestExist, adminController.approveRequest);
  app.put('/requests/:id/disapprove', authorizeAdmin, verifyIfRequestExist, adminController.rejectRequest);
  app.put('/requests/:id/resolve', authorizeAdmin, verifyIfRequestExist, adminController.resolveRequest);
};
