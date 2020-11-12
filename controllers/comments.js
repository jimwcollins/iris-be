const { updateCommentVote } = require('../models/comments');

const patchCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;
  const voteUpdate = req.body.inc_votes;

  updateCommentVote(commentId, voteUpdate)
    .then((returnedComment) => {
      res.status(200).send(returnedComment);
    })
    .catch(next);
};

const deleteCommentById = (req, res, next) => {
  console.log('Delete comment controller');
};

module.exports = { patchCommentById, deleteCommentById };
