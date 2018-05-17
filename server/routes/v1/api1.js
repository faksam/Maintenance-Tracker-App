import express from 'express';
import indexRoute from './index';
import usersRoute from './users';

const app = express.Router();
indexRoute(app);
usersRoute(app);

module.exports = app;

