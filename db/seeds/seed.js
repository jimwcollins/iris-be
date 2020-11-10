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
      return knex('topics').insert(topicData).returning('*');
    })
    .then((topicsRows) => {
      return knex('users').insert(userData).returning('*');
    })
    .then((usersRows) => {
      const formattedArticleData = formatArticles(articleData);

      return knex('articles').insert(formattedArticleData).returning('*');
    })
    .then((articleRows) => {
      const articleRef = getArticleRef(articleRows);

      const formattedCommentData = formatComments(commentData, articleRef);

      return knex('comments').insert(formattedCommentData).returning('*');
    });
};
