const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');

const authRouter = require('./routes/auth.routes');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cookieParser());

app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'success',
  });
});

app.use('/api/auth', authRouter);

// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this sever!`, '404'));
// });
app.use(globalErrorHandler);

module.exports = app;
