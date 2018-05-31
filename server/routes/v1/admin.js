import adminController from '../../controllers/adminController';
import { checkIfRequestExist, verifyUserToken, validateRequestID, verifyDisapprovalInput, checkIfRequestNew, checkIfRequestRejectable, checkIfRequestPending } from '../../helpers/validator';
import { authorizeAdmin } from '../../middleware/authorize';

export default app => {
  app.get('/requests', verifyUserToken, authorizeAdmin, adminController.getRequests);
  app.get('/requests/:id', verifyUserToken, authorizeAdmin, adminController.getRequest);
  app.put('/requests/:id/approve', verifyUserToken, authorizeAdmin, validateRequestID, checkIfRequestExist, checkIfRequestNew, adminController.approveRequest);
  app.put('/requests/:id/disapprove', verifyUserToken, authorizeAdmin, validateRequestID, checkIfRequestExist, verifyDisapprovalInput, checkIfRequestRejectable, adminController.rejectRequest);
  app.put('/requests/:id/resolve', verifyUserToken, authorizeAdmin, validateRequestID, checkIfRequestExist, checkIfRequestPending, adminController.resolveRequest);
};
