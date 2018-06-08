import accountController from '../../controllers/accountController';
import { verifyUserToken } from '../../helpers/validator';
import { authorizeUser } from '../../middleware/authorize';
import { validateUpdateAccountInput, validateUpdatePasswordInput, checkCurrentPasswordInput } from '../../helpers/userValidator';

export default (app) => {
  app.get('/users/account', verifyUserToken, authorizeUser, accountController.getUserDetails);
  app.put('/users/account', verifyUserToken, authorizeUser, validateUpdateAccountInput, accountController.updateUserDetails);
  app.put('/users/account/password', verifyUserToken, authorizeUser, validateUpdatePasswordInput, checkCurrentPasswordInput, accountController.updateUserPassword);
};
