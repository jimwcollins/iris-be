const articlesRouter = require('express').Router();
const {
  getArticleById,
  deleteArticleById,
  patchArticleById,
  postCommentByArticleId,
} = require('../controllers/articles');

articlesRouter
  .route('/:articleId')
  .get(getArticleById)
  .delete(deleteArticleById)
  .patch(patchArticleById);

articlesRouter.route('/:articleId/comments').post(postCommentByArticleId);

module.exports = articlesRouter;
