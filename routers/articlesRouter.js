const articlesRouter = require('express').Router();
const {
  getArticleById,
  deleteArticleById,
} = require('../controllers/articles');

articlesRouter
  .route('/:articleId')
  .get(getArticleById)
  .delete(deleteArticleById);

module.exports = articlesRouter;
