const connection = require('../db/connection');

const fetchCommentsByArticleId = (articleId, { sort_by, order }) => {
  return connection('comments')
    .select('comments.*')
    .rightJoin('articles', 'articles.article_id', 'comments.article_id')
    .where('articles.article_id', '=', articleId)
    .orderBy(sort_by || 'created_at', order || 'desc')
    .then((comments) => {
      if (comments.length === 0) {
        // There are no articles with this ID
        return Promise.reject({
          status: 404,
          msg: 'No articles found with this ID'
        });
      } else if (comments.length === 1 && comments[0].comment_id === null) {
        // The only row returned is for the article and there is no comment data
        return {
          comments: 'No comments found for this article'
        };
      } else {
        return {
          comments
        };
      }
    });
};

const insertCommentByArticleId = (articleId, { username, body }) => {
  if (!username && !body)
    return Promise.reject({ status: 400, msg: 'Invalid post data' });

  if (!username || typeof username !== 'string')
    return Promise.reject({ status: 400, msg: 'Invalid username data' });

  if (!body) return Promise.reject({ status: 400, msg: 'Invalid body data' });

  return connection('comments')
    .insert({ author: username, article_id: articleId, body: body })
    .returning('*')
    .then(([insertedComment]) => {
      return {
        comment: insertedComment
      };
    });
};

const updateCommentVote = (commentId, voteUpdate) => {
  if (!voteUpdate || typeof voteUpdate !== 'number')
    return Promise.reject({ status: 400, msg: 'Invalid vote data' });

  return connection('comments')
    .where('comment_id', '=', commentId)
    .increment('votes', voteUpdate)
    .returning('*')
    .then(([updatedComment]) => {
      if (!updatedComment)
        return Promise.reject({ status: 404, msg: 'Comment not found' });

      return {
        comment: updatedComment
      };
    });
};

const removeCommentById = (commentId) => {
  return connection('comments')
    .del()
    .where('comment_id', '=', commentId)
    .then((numRowsDeleted) => {
      if (numRowsDeleted === 0)
        return Promise.reject({ status: 404, msg: 'Comment not found' });

      return;
    });
};

module.exports = {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  updateCommentVote,
  removeCommentById
};
