/* eslint no-console: 0 */


import nodemailer from 'nodemailer';
import { Pool } from 'pg';

import { setConnectionString } from './connectionString';

const connectionString = setConnectionString();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MTA_EMAIL,
    pass: process.env.MTA_PASSWORD,
  },
});

const mailOptions = {
  from: process.env.MTA_EMAIL,
  subject: 'MTA Notification - Request Status Change',
};

export const sendNotification = (req) => {
  const { data, user } = req;
  let { comment } = data[0];
  if (comment === null) {
    comment = 'N/A';
  }
  mailOptions.to = user.email;
  mailOptions.html = `<h3>Hi ${user.fullname},</h3>
    <h3>Your request is: ${data[0].status}</h3>
    <p><b>Request Title</b> - ${data[0].title}</p>
    <p><b>Request Description</b> - ${data[0].description}</p>
    <p><b>Rejection Reason</b> - ${comment}</p>
    <p><b>***Note</b> - If you did not make a request on MTA please ignore this email.</p>`;
  transporter.sendMail(mailOptions, () => { });
};

/**
 * @description - Gets user details
 *
 * @param {string} userid User Id
 *
 * @returns {object} returns user object parameter
 */
export const getUserDetails = (req, res, next) => {
  const userId = req.data[0].userid;
  const pool = new Pool({
    connectionString,
  });
  const selectQuery = {
    name: 'get-users-requests',
    text: 'SELECT * FROM users WHERE id = $1',
    values: [userId],
  };
  pool.query(selectQuery, (err, result) => {
    [req.user] = result.rows;
    pool.end();
    next();
  });
};
