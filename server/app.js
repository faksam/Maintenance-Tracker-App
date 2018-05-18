import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import expressValidator from 'express-validator';

import apiv1 from './routes/v1/api1';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../UI'));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

// Start server
const PORT = process.env.PORT || 3456;
app.listen(PORT, () => {
  // console.log(`The app is running on port ${PORT}`);
});

app.use(expressValidator());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../UI')));

// // Require static assets from template folder
app.use('../UI', express.static(path.join(`${__dirname}../UI`)));

app.use('/api/v1/', apiv1);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});


// error handler
app.use((err, req, res) => {
  // render the error page
  if (err.status) { res.status(err.status); } else { res.status(500); }
  res.send({
    // ErrorMessage: err.message,
    ErrorStatus: err.status,
  });
});

module.exports = app;
