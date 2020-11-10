const {
  topicData,
  articleData,
  commentData,
  userData,
} = require('../data/index.js');

const {
  dateFormatter,
  getArticleRef,
  formatComment,
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
      const formattedArticleData = dateFormatter(articleData);

      return knex('articles').insert(formattedArticleData).returning('*');
    })
    .then((articleRows) => {

      const formattedTimeCommentData = dateFormatter(commentData);

      const articleRef = getArticleRef(articleRows);

      const formattedCommentData = formatComment(
        formattedTimeCommentData,
        articleRef
      );

      return knex('comments').insert(formattedCommentData).returning('*');
    })
    // .then((commentRows) => {});
};
