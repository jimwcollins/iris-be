const { get } = require('../app');
const { fetchArticleById, delArticleById } = require('../models/articles');

const getArticleById = (req, res, next) => {
  const articleId = req.params.articleId;

  fetchArticleById(articleId)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

const deleteArticleById = (req, res, next) => {
  const articleId = req.params.articleId;

  delArticleById(articleId).then(() => {
    res.status(204).send({ msg: 'Article deleted' });
  });
};

module.exports = { getArticleById, deleteArticleById };
