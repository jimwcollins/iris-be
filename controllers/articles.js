const { get } = require('../app');
const {
  fetchArticleById,
  removeArticleById,
  updateArticleVote,
} = require('../models/articles');

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

  removeArticleById(articleId)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

const patchArticleById = (req, res, next) => {
  const articleId = req.params.articleId;
  const voteUpdate = req.body;
  updateArticleVote(articleId, voteUpdate)
    .then((updatedArticle) => {
      res.status(200).send(updatedArticle);
    })
    .catch(next);
};

module.exports = { getArticleById, deleteArticleById, patchArticleById };
