import adminController from '../../controllers/adminController';
import { sendNotification, getUserDetails } from '../../helpers/nodemailerHelper';
import { authorizeAdmin } from '../../middleware/authorize';
import {
  checkIfRequestExist,
  verifyUserToken,
  validateRequestID,
  verifyDisapprovalInput,
  checkIfRequestNew,
  checkIfRequestRejectable,
  checkIfRequestPending,
  countAllRequests,
  validatePageQuery,
} from '../../helpers/validator';

export default (app) => {
  app.get('/requests', verifyUserToken, authorizeAdmin, validatePageQuery, countAllRequests, adminController.getRequests);
  app.get('/requests/:id([0-9]+)', verifyUserToken, authorizeAdmin, adminController.getRequest);
  app.put('/requests/:id([0-9]+)/approve', verifyUserToken, authorizeAdmin, validateRequestID, checkIfRequestExist, checkIfRequestNew, adminController.approveRequest, getUserDetails, sendNotification);
  app.put('/requests/:id([0-9]+)/disapprove', verifyUserToken, authorizeAdmin, validateRequestID, checkIfRequestExist, verifyDisapprovalInput, checkIfRequestRejectable, adminController.rejectRequest, getUserDetails, sendNotification);
  app.put('/requests/:id([0-9]+)/resolve', verifyUserToken, authorizeAdmin, validateRequestID, checkIfRequestExist, checkIfRequestPending, adminController.resolveRequest, getUserDetails, sendNotification);
  app.delete('/requests/:id([0-9]+)/delete', verifyUserToken, authorizeAdmin, validateRequestID, checkIfRequestExist, adminController.deleteRequest);
};
