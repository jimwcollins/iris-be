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
      console.log(`inserted ${topicsRows.length} topics`);
      return knex('users').insert(userData).returning('*');
    })
    .then((usersRows) => {
      console.log(`inserted ${usersRows.length} users`);

      const formattedArticleData = dateFormatter(articleData);

      return knex('articles').insert(formattedArticleData).returning('*');
    })
    .then((articleRows) => {
      console.log(`inserted ${articleRows.length} articles`);

      const formattedTimeCommentData = dateFormatter(commentData);

      const articleRef = getArticleRef(articleRows);

      const formattedCommentData = formatComment(
        formattedTimeCommentData,
        articleRef
      );

      return knex('comments').insert(formattedCommentData).returning('*');
    })
    .then((commentRows) => {
      console.log(`inserted ${commentRows.length} comments`);
    });
};
