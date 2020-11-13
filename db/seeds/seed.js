const {
  topicData,
  articleData,
  commentData,
  userData,
} = require('../data/index.js');

const {
  formatArticles,
  getArticleRef,
  formatComments,
} = require('../utils/data-manipulation.js');

exports.seed = (knex) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsPromise = knex('topics').insert(topicData);
      const usersPromise = knex('users').insert(userData);

      return Promise.all([topicsPromise, usersPromise]);
    })
    .then(() => {
      const formattedArticleData = formatArticles(articleData);

      return knex('articles').insert(formattedArticleData).returning('*');
    })
    .then((articleRows) => {
      const articleRef = getArticleRef(articleRows);

      const formattedCommentData = formatComments(commentData, articleRef);

      return knex('comments').insert(formattedCommentData).returning('*');
    });
};
