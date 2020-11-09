// extract any functions you are using to manipulate your data, into this file

const dateFormatter = (articles) => {
  return articles.map((article) => {
    const newObj = { ...article };
    newObj.created_at = new Date(article.created_at).toISOString();
    return newObj;
  });
};

const getArticleRef = (articleData) => {
  const articleRef = {};
  articleData.forEach((article) => {
    articleRef[article.title] = article.article_id;
  });
  return articleRef;
};

const formatComment = (commentData, articleRef) => {
  return commentData.map((comment) => {
    const newObj = { ...comment };
    newObj.article_id = articleRef[comment.belongs_to];
    delete newObj.belongs_to;
    newObj.author = comment.created_by;
    delete newObj.created_by;
    return newObj;
  });
};

module.exports = { dateFormatter, getArticleRef, formatComment };
