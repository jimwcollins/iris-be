const articlesRouter = require('express').Router();
const {
  getArticleById,
  deleteArticleById,
  patchArticleById,
} = require('../controllers/articles');

articlesRouter
  .route('/:articleId')
  .get(getArticleById)
  .delete(deleteArticleById)
  .patch(patchArticleById);

module.exports = articlesRouter;
