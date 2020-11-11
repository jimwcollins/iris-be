const send404 = (req, res, next) => {
  res.status(404).send({ msg: 'Route not found' });
};

const handlePSQLErrors = (err, req, res, next) => {
  console.log('PSQL Error:', err);
  const badReqCode = ['42703', '22P02'];
  if (badReqCode.includes(err.code)) {
    res.status(400).send({ msg: 'Bad request' });
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
