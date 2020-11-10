const articlesRouter = require('express').Router();
const { getArticleById } = require('../controllers/articles');

articlesRouter.route('/:articleId').get(getArticleById);

module.exports = articlesRouter;
