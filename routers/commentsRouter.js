const commentsRouter = require('express').Router();

const {
  patchCommentById,
  deleteCommentById,
} = require('../controllers/comments.js');

const { sendInvalidMethod } = require('../controllers/errors');

commentsRouter
  .route('/:comment_id')
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(sendInvalidMethod);

module.exports = commentsRouter;
