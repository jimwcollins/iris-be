// extract any functions you are using to manipulate your data, into this file

const formatTimestamp = (time) => {
  return new Date(time).toISOString();
};

const formatArticles = (articles) => {
  return articles.map(({ created_at, ...restOfArticle }) => {
    return {
      ...restOfArticle,
      created_at: formatTimestamp(created_at),
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
        created_at: formatTimestamp(created_at),
      };
    }
  );
};

module.exports = {
  formatTimestamp,
  formatArticles,
  getArticleRef,
  formatComments,
};
