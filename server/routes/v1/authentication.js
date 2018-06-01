import { verrifyUserExist, validateSignUpInput, validateSignInInput, checkIfUserExist, verifyUserPassword } from '../../helpers/userValidator';
import authentication from '../../controllers/authController';

export default (app) => {
  app.post('/auth/signup', validateSignUpInput, verrifyUserExist, authentication.signup);
  app.post('/auth/login', validateSignInInput, checkIfUserExist, verifyUserPassword, authentication.login);
};
