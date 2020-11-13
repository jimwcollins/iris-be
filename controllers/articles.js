const {
  fetchAllArticles,
  insertNewArticle,
  fetchArticleById,
  removeArticleById,
  updateArticleVote,
} = require('../models/articles');

const getAllArticles = (req, res, next) => {
  const queries = req.query;
  fetchAllArticles(queries)
    .then((returnedArticles) => {
      res.status(200).send(returnedArticles);
    })
    .catch(next);
};

const postNewArticle = (req, res, next) => {
  const articleData = req.body;
  insertNewArticle(articleData)
    .then((insertedArticle) => {
      res.status(201).send(insertedArticle);
    })
    .catch(next);
};

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

module.exports = {
  getAllArticles,
  postNewArticle,
  getArticleById,
  deleteArticleById,
  patchArticleById,
};
