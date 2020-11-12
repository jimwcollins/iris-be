const { get } = require('../app');
const {
  fetchArticleById,
  removeArticleById,
  updateArticleVote,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
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

const getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.articleId;
  const queries = req.query;
  fetchCommentsByArticleId(articleId, queries)
    .then((returnedComments) => {
      res.status(200).send(returnedComments);
    })
    .catch(next);
};

const postCommentByArticleId = (req, res, next) => {
  const articleId = req.params.articleId;
  const articleData = req.body;
  insertCommentByArticleId(articleId, articleData)
    .then((insertedComment) => {
      res.status(201).send(insertedComment);
    })
    .catch(next);
};

module.exports = {
  getArticleById,
  deleteArticleById,
  patchArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
};
