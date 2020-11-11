const send404 = (req, res, next) => {
  res.status(404).send({ msg: 'Route not found' });
};

const handlePSQLErrors = (err, req, res, next) => {
  console.log('PSQL error:', err);
  const badReqCodes = ['42703', '22P02'];
  const invalidIdCodes = ['23503'];

  if (badReqCodes.includes(err.code)) {
    res.status(400).send({ msg: 'Bad request' });
  } else if (invalidIdCodes.includes(err.code)) {
    res.status(404).send({ msg: 'Invalid ID or user' });
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
  res.status(500).send({ msg: 'Internal server error' });
};

module.exports = {
  send404,
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalServerErrors,
};
