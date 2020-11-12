const connection = require('../db/connection');

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
        comment: updatedComment,
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

module.exports = { updateCommentVote, removeCommentById };
