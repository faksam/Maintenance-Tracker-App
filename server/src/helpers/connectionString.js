import dotenv from 'dotenv';

dotenv.config();
/**
 * Set And Return Database Connection String
 *
 * @returns {string} Database Connection String
 */
export const setConnectionString = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.DATABASE_URL;
  }
  return process.env.use_env_variable;
};

export default setConnectionString;
