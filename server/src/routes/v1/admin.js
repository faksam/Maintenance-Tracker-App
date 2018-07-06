import adminController from '../../controllers/adminController';
import { sendNotification, getUserDetails } from '../../helpers/nodemailerHelper';
import { authorizeAdmin } from '../../middleware/authorize';
import { checkIfRequestExist } from '../../helpers/checkIfRequestExist';
import { verifyDisapprovalInput } from '../../helpers/verifyDisapprovalInput';
import { checkIfRequestIsNew } from '../../helpers/checkIfRequestIsNew';
import { checkIfRequestRejectable } from '../../helpers/checkIfRequestRejectable';
import { checkIfRequestPending } from '../../helpers/checkIfRequestPending';
import { countAllRequests } from '../../helpers/countAllRequests';
import { verifyUserToken } from '../../validators/tokenValidator';
import { validateRequestID } from '../../validators/validateRequestID';
import { validatePageQuery } from '../../validators/validatePageQuery';
import { checkDisapprovalInput } from '../../helpers/checkDisapprovalInput';

export default (app) => {
  app.get('/requests', verifyUserToken, authorizeAdmin, validatePageQuery, countAllRequests, adminController.getRequests);
  app.get('/requests/filter', verifyUserToken, authorizeAdmin, adminController.filterRequests);
  app.get('/requests/:id([0-9]+)', verifyUserToken, authorizeAdmin, adminController.getRequest);
  app.put('/requests/:id([0-9]+)/approve', verifyUserToken, authorizeAdmin, validateRequestID, checkIfRequestExist, checkIfRequestIsNew, adminController.approveRequest, getUserDetails, sendNotification);
  app.put('/requests/:id([0-9]+)/disapprove', verifyUserToken, authorizeAdmin, validateRequestID, checkIfRequestExist, checkDisapprovalInput, verifyDisapprovalInput, checkIfRequestRejectable, adminController.rejectRequest, getUserDetails, sendNotification);
  app.put('/requests/:id([0-9]+)/resolve', verifyUserToken, authorizeAdmin, validateRequestID, checkIfRequestExist, checkIfRequestPending, adminController.resolveRequest, getUserDetails, sendNotification);
  app.delete('/requests/:id([0-9]+)/delete', verifyUserToken, authorizeAdmin, validateRequestID, checkIfRequestExist, adminController.deleteRequest);
};
