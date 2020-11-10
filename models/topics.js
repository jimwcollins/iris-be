const connection = require('../db/connection');

const fetchTopic = () => {
  return connection('topics')
    .select('slug', 'description')
    .then((topics) => {
      return { topics };
    });
};

module.exports = { fetchTopic };
