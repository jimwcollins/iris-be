const send404 = (req, res, next) => {
  res.status(404).send({ msg: 'Route not found' });
};

const sendInvalidMethod = (req, res, next) => {
  res.status(405).send({ msg: 'Invalid method' });
};

const handlePSQLErrors = (err, req, res, next) => {
  const badReqCodes = ['42703', '22P02'];
  const invalidIdCodes = ['23503'];

  if (badReqCodes.includes(err.code)) {
    res.status(400).send({ msg: 'Bad request' });
  } else if (invalidIdCodes.includes(err.code)) {
    res.status(400).send({ msg: 'Invalid data' });
  } else {
    next(err);
  }
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const handleInternalServerErrors = (err, req, res, next) => {
  console.log('Internal error:', err);
  res.status(500).send({ msg: 'Internal server error' });
};

module.exports = {
  send404,
  sendInvalidMethod,
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalServerErrors,
};
