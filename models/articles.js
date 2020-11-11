const connection = require('../db/connection');

const fetchArticleById = (articleId) => {
  return connection('articles')
    .select('articles.*')
    .count('comments.comment_id AS comment_count')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .where('articles.article_id', '=', articleId)
    .groupBy('articles.article_id')
    .then(([returnedArticle]) => {
      if (!returnedArticle)
        return Promise.reject({ status: 404, msg: 'Article not found' });

      const { comment_count, ...restOfArticle } = returnedArticle;

      return {
        article: {
          ...restOfArticle,
          comment_count: parseInt(comment_count, 10),
        },
      };
    });
};

const removeArticleById = (articleId) => {
  return connection('articles')
    .del()
    .where('article_id', '=', articleId)
    .then((numRowsDeleted) => {
      if (numRowsDeleted === 0)
        return Promise.reject({ status: 404, msg: 'Article not found' });

      return;
    });
};

const updateArticleVote = (articleId, { inc_votes }) => {
  if (!inc_votes || typeof inc_votes !== 'number')
    return Promise.reject({ status: 400, msg: 'Invalid patch data' });

  return connection('articles')
    .where('article_id', '=', articleId)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([updatedArticle]) => {
      if (!updatedArticle)
        return Promise.reject({ status: 404, msg: 'Article not found' });

      return {
        article: updatedArticle,
      };
    });
};

module.exports = { fetchArticleById, removeArticleById, updateArticleVote };
