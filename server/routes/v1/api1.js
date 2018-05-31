import express from 'express';
import indexRoute from './index';
import usersRoute from './users';
import adminRoute from './admin';
import authenticationRoute from './authentication';

const app = express.Router();
indexRoute(app);
usersRoute(app);
adminRoute(app);
authenticationRoute(app);

export default app;

