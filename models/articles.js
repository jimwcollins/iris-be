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

const fetchCommentsByArticleId = (articleId, { sort_by, order }) => {
  return connection('comments')
    .select('comments.*')
    .rightJoin('articles', 'articles.article_id', 'comments.article_id')
    .where('articles.article_id', '=', articleId)
    .orderBy(sort_by || 'created_at', order || 'asc')
    .then((comments) => {
      if (comments.length === 0) {
        // There are no articles with this ID
        return Promise.reject({
          status: 404,
          msg: 'No articles found with this ID',
        });
      } else if (comments.length === 1 && comments[0].comment_id === null) {
        // The only row returned is for the article and there is no comment data
        return {
          comments: 'No comments found for this article',
        };
      } else {
        return {
          comments,
        };
      }
    });
};

const insertCommentByArticleId = (articleId, { username, body }) => {
  if (!username && !body)
    return Promise.reject({ status: 400, msg: 'Invalid post data' });

  if (!username || typeof username !== 'string')
    return Promise.reject({ status: 400, msg: 'Invalid username data' });

  if (!body) return Promise.reject({ status: 400, msg: 'Invalid body data' });

  return connection('comments')
    .insert({ author: username, article_id: articleId, body: body })
    .returning('*')
    .then(([insertedComment]) => {
      return {
        comment: insertedComment,
      };
    });
};

module.exports = {
  fetchAllArticles,
  fetchArticleById,
  removeArticleById,
  updateArticleVote,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
};
