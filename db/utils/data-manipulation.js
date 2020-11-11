// extract any functions you are using to manipulate your data, into this file

const getTimestamp = (time) => {
  return new Date(time);
};

const formatArticles = (articles) => {
  return articles.map(({ created_at, ...restOfArticle }) => {
    return {
      ...restOfArticle,
      created_at: getTimestamp(created_at),
    };
  });
};

const getArticleRef = (articleData) => {
  const articleRef = {};
  articleData.forEach((article) => {
    articleRef[article.title] = article.article_id;
  });
  return articleRef;
};

const formatComments = (commentData, articleRef) => {
  return commentData.map(
    ({ belongs_to, created_by, created_at, ...restOfComment }) => {
      return {
        article_id: articleRef[belongs_to],
        author: created_by,
        ...restOfComment,
        created_at: getTimestamp(created_at),
      };
    }
  );
};

module.exports = {
  getTimestamp,
  formatArticles,
  getArticleRef,
  formatComments,
};
