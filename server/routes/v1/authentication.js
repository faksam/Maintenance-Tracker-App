import { verrifyUserExist, validateSignUpInput, validateSignInInput, checkIfUserExist } from '../../helpers/userValidator';
import authentication from '../../controllers/authController';

export default (app) => {
  app.post('/auth/signup', validateSignUpInput, verrifyUserExist, authentication.signup);
  app.post('/auth/login', validateSignInInput, checkIfUserExist, authentication.login);
};
