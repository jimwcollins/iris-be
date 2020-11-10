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

const delArticleById = (articleId) => {
  console.log(`Deleting article ${articleId}`);
};

module.exports = { fetchArticleById, delArticleById };
