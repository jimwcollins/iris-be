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
    .select('*')
    .where('topics.slug', 'LIKE', `%${topicSlug}%`)
    .then((topics) => {
      if (!topics)
        return Promise.reject({ status: 404, msg: 'No topics found' });

      return { topics };
    });
};

module.exports = { fetchAllTopics, fetchTopicBySlug };
