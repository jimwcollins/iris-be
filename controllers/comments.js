const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  updateCommentVote,
  removeCommentById,
} = require('../models/comments');

const getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.articleId;
  const queries = req.query;
  fetchCommentsByArticleId(articleId, queries)
    .then((returnedComments) => {
      res.status(200).send(returnedComments);
    })
    .catch(next);
};

const postCommentByArticleId = (req, res, next) => {
  const articleId = req.params.articleId;
  const articleData = req.body;
  insertCommentByArticleId(articleId, articleData)
    .then((insertedComment) => {
      res.status(201).send(insertedComment);
    })
    .catch(next);
};

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

module.exports = {
  getCommentsByArticleId,
  postCommentByArticleId,
  patchCommentById,
  deleteCommentById,
};
