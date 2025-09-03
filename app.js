const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

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

module.exports = app;
