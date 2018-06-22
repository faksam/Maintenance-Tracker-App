import accountController from '../../controllers/accountController';
import { authorizeUser } from '../../middleware/authorize';
import { checkPasswordInput } from '../../helpers/checkPasswordInput';
import { verifyUserToken } from '../../validators/tokenValidator';
import { validateEditAccount } from '../../validators/validateEditAccount';
import { validateEditPassword } from '../../validators/validateEditPassword';

export default (app) => {
  app.get('/users/account', verifyUserToken, authorizeUser, accountController.getUserDetails);
  app.put('/users/account', verifyUserToken, authorizeUser, validateEditAccount, accountController.updateUserDetails);
  app.put('/users/account/password', verifyUserToken, authorizeUser, validateEditPassword, checkPasswordInput, accountController.updateUserPassword);
};

