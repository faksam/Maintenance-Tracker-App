import { checkEmailExist } from '../../helpers/checkEmailExist';
import { checkIfUserExist } from '../../helpers/checkIfUserExist';
import { verifyUserPassword } from '../../helpers/verifyUserPassword';
import { validateSignInInput } from '../../validators/validateSignInInput';
import { validateSignUpInput } from '../../validators/validateSignUpInput';
import authentication from '../../controllers/authController';

export default (app) => {
  app.post('/auth/signup', validateSignUpInput, checkEmailExist, authentication.signup);
  app.post('/auth/login', validateSignInInput, checkIfUserExist, verifyUserPassword, authentication.login);
};
