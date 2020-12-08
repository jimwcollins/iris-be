const express = require('express');
const app = express();
const apiRouter = require('./routers/apiRouter');
const cors = require('cors');

const {
  send404,
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalServerErrors
} = require('./controllers/errors');

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', send404);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalServerErrors);

module.exports = app;
