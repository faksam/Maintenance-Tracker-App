import express from 'express';
import indexRoute from './index';
// import authenticationRoute from './authentication';
// import mealsRoute from './meals';
// import menuRoute from './menu';
// import ordersRoute from './orders';

const app = express.Router();
indexRoute(app);
// authenticationRoute(app);
// mealsRoute(app);
// menuRoute(app);
// ordersRoute(app);

module.exports = app;

