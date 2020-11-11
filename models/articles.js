const connection = require('../db/connection');

const fetchArticleById = (articleId) => {
  return connection('articles')
    .select('*')
    .where('article_id', '=', articleId)
    .then(([returnedArticle]) => {
      if (!returnedArticle)
        return Promise.reject({ status: 404, msg: 'Article not found' });

      const commentPromise = connection('comments')
        .select('*')
        .where('article_id', '=', articleId);

      return Promise.all([commentPromise, returnedArticle]);
    })
    .then(([comments, returnedArticle]) => {
      return {
        article: {
          ...returnedArticle,
          comment_count: comments.length,
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
  console.log('Patching article', articleId);
  console.log('Votes', inc_votes);

  return connection('articles')
    .where('article_id', '=', articleId)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([updatedArticle]) => {
      return {
        article: updatedArticle,
      };
    });
};

module.exports = { fetchArticleById, removeArticleById, updateArticleVote };
