const { updateCommentVote, removeCommentById } = require('../models/comments');

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
  const commentId = req.params.comment_id;
  removeCommentById(commentId)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

module.exports = { patchCommentById, deleteCommentById };
