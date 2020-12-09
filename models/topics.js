const connection = require('../db/connection');

const fetchAllTopics = () => {
  return connection('topics')
    .select('slug', 'description')
    .then((topics) => {
      return { topics };
    });
};

const fetchTopicBySlug = (topicSlug) => {
  return connection('topics')
    .select('slug', 'description')
    .where('topics.slug', '=', topicSlug)
    .then(([topic]) => {
      if (!topic)
        return Promise.reject({ status: 404, msg: 'Topic not found' });

      return { topic };
    });
};

module.exports = { fetchAllTopics, fetchTopicBySlug };
