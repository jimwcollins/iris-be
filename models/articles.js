const { queryBuilder } = require('../db/connection');
const connection = require('../db/connection');

const fetchAllArticles = ({ sort_by, order, author, topic }) => {
  return connection('articles')
    .select('articles.*')
    .count('comments.comment_id AS comment_count')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .modify((query) => {
      if (author) query.where('articles.author', '=', author);
      if (topic) query.where('articles.topic', '=', topic);
    })
    .groupBy('articles.article_id')
    .orderBy(sort_by || 'created_at', order || 'asc')
    .then((returnedArticles) => {
      // Map returned articles to new array, with comment count
      // parsed into int for each object
      const parsedArticles = returnedArticles.map(
        ({ comment_count, ...restOfArticle }) => {
          return {
            ...restOfArticle,
            comment_count: parseInt(comment_count, 10),
          };
        }
      );

      return {
        articles: parsedArticles,
      };
    });
};

const insertNewArticle = (articleData) => {
  const { title, body, topic, author } = articleData;

  // Check we have all required data
  if (!(title && body && topic && author)) {
    return Promise.reject({ status: 400, msg: 'Invalid article data' });
  }

  return connection('articles')
    .insert({
      title: title,
      body: body,
      topic: topic,
      author: author,
    })
    .returning('*')
    .then(([insertedArticle]) => {
      return {
        article: insertedArticle,
      };
    });
};

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

      // Break out comment_count so we can convert to int
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

module.exports = {
  fetchAllArticles,
  insertNewArticle,
  fetchArticleById,
  removeArticleById,
  updateArticleVote,
};
