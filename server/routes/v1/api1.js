import express from 'express';
import indexRoute from './index';
import usersRoute from './users';
import adminRoute from './admin';
import authenticationRoute from './authentication';
import accountRoute from './account';

const app = express.Router();
indexRoute(app);
usersRoute(app);
adminRoute(app);
authenticationRoute(app);
accountRoute(app);

export default app;

