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

// /articles
articlesRouter.route('/').get(getAllArticles).post(postNewArticle);

// /articles/:articleId
articlesRouter
  .route('/:articleId')
  .get(getArticleById)
  .delete(deleteArticleById)
  .patch(patchArticleById);

// /articles/:articleId/comments
articlesRouter
  .route('/:articleId/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
