const { fetchAllTopics, fetchTopicBySlug } = require('../models/topics');

const getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch(next);
};

const getTopicBySlug = (req, res, next) => {
  const { topicSlug } = req.params;

  fetchTopicBySlug(topicSlug)
    .then((topic) => {
      res.status(200).send(topic);
    })
    .catch(next);
};

module.exports = { getAllTopics, getTopicBySlug };
