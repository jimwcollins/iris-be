const articlesRouter = require('express').Router();
const {
  getAllArticles,
  postNewArticle,
  getArticleById,
  deleteArticleById,
  patchArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
} = require('../controllers/articles');

const { sendInvalidMethod } = require('../controllers/errors');

// /articles
articlesRouter
  .route('/')
  .get(getAllArticles)
  .post(postNewArticle)
  .all(sendInvalidMethod);

// /articles/:articleId
articlesRouter
  .route('/:articleId')
  .get(getArticleById)
  .delete(deleteArticleById)
  .patch(patchArticleById)
  .all(sendInvalidMethod);

// /articles/:articleId/comments
articlesRouter
  .route('/:articleId/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(sendInvalidMethod);

module.exports = articlesRouter;
