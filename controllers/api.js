const { fetchApiEndpoints } = require('../models/api');

const getApiEndpoints = (req, res, next) => {
  const apiJSON = fetchApiEndpoints();
  res.status(200).send(apiJSON);
};

module.exports = { getApiEndpoints };
