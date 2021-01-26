const {
  fetchAllArticles,
  insertNewArticle,
  fetchArticleById,
  removeArticleById,
  updateArticleVote,
} = require('../models/articles');

const getAllArticles = (req, res, next) => {
  // Set limit and offset
  let limit = Number(req.query.limit);
  const page = Number(req.query.p);
  if (Number.isNaN(limit)) limit = 50;
  const offset = page ? (page - 1) * limit : 0;

  fetchAllArticles(req.query)
    .then((returnedArticles) => {
      const articles = {
        total_count: returnedArticles.length,
        articles: returnedArticles.slice(offset, offset + limit),
      };

      res.status(200).send(articles);
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
  const { articleId } = req.params;

  fetchArticleById(articleId)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

const deleteArticleById = (req, res, next) => {
  const { articleId } = req.params;

  removeArticleById(articleId)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

const patchArticleById = (req, res, next) => {
  const { articleId } = req.params;
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
