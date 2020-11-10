const { fetchTopic } = require('../models/topics');

const getTopic = (req, res, next) => {
  fetchTopic()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch(next);
};

module.exports = { getTopic };
