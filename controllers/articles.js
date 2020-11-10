const { get } = require('../app');
const { fetchArticleById } = require('../models/articles');

const getArticleById = (req, res, next) => {
  const articleId = req.params.articleId;

  fetchArticleById(articleId)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

module.exports = { getArticleById };
