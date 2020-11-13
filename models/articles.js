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
      let topicExists = true;
      let authorExists = true;

      // If we have an empty array, do further tests
      if (returnedArticles.length === 0) {
        if (topic) topicExists = checkTopicExists(topic);

        if (author) authorExists = checkAuthorExists(author);
      }

      return Promise.all([returnedArticles, authorExists, topicExists]);
    })
    .then(([articles, authorExists, topicExists]) => {
      // Perform checks to see if author and topic exist.
      // If not, reject promise.
      if (!topicExists && !authorExists) {
        return Promise.reject({
          status: 404,
          msg: 'Author and topic not found',
        });
      }

      if (!topicExists) {
        return Promise.reject({ status: 404, msg: 'Topic not found' });
      }

      if (!authorExists) {
        return Promise.reject({ status: 404, msg: 'Author not found' });
      }

      // Check if we have any articles
      if (articles.length === 0) {
        if (author && topic) {
          return {
            articles: 'No articles found for author and topic',
          };
        }

        if (topic) {
          return {
            articles: 'No articles found for topic',
          };
        }

        if (author) {
          return {
            articles: 'No articles found for author',
          };
        }
      }

      // Otherwise we're all good!
      // Map returned articles to new array, with comment count
      // parsed into int for each object
      const parsedArticles = articles.map(
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

const checkTopicExists = (topic) => {
  return connection('topics')
    .select('*')
    .where('slug', '=', topic)
    .then((topics) => {
      if (topics.length === 0) return false;
      else return true;
    });
};

const checkAuthorExists = (author) => {
  return connection('users')
    .select('*')
    .where('username', '=', author)
    .then((users) => {
      if (users.length === 0) return false;
      else return true;
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
