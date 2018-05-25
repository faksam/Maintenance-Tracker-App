import express from 'express';
import indexRoute from './index';
import usersRoute from './users';
import authenticationRoute from './authentication';

const app = express.Router();
indexRoute(app);
usersRoute(app);
authenticationRoute(app);

module.exports = app;

