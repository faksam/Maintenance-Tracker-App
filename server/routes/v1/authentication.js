import { verrifyUserExist, validateSignUpInput } from '../../helpers/userValidator';
import authentication from '../../controllers/authController';

module.exports = (app) => {
  app.post('/auth/signup', validateSignUpInput, verrifyUserExist, authentication.signup);
};
