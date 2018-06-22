import express from 'express';
import usersRoute from './users';
import adminRoute from './admin';
import authenticationRoute from './authentication';
import accountRoute from './account';

const app = express.Router();
usersRoute(app);
adminRoute(app);
authenticationRoute(app);
accountRoute(app);

app.get('/', (req, res) => {
  res.redirect('https://maintenancetracker.docs.apiary.io/');
});

export default app;

