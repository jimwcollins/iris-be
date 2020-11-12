const fetchApiEndpoints = () => {
  const apiJSON = {
    'NC NEWS ENDPOINTS': {
      '/api/topics': {
        GET: {
          Returns: 'Array of topics objects',
          Parameters: 'None',
        },
      },
      '/api/users/:username': {
        GET: {
          Returns: 'A user object for given username',
          Parameters: 'Username',
        },
      },
      '/api/articles/': {
        GET: {
          Returns: 'An array of article objects',
          Parameters: 'None',
          Queries: 'sort_by, order, author, topic',
        },
        POST: {
          Returns: 'The inserted article object',
          'Request body requires': 'Title, body, topic, author',
        },
      },
      '/api/articles/:article_id': {
        GET: {
          Returns: 'An article object for given Article ID',
          Parameters: 'Article ID',
        },
        PATCH: {
          Returns: 'The updated Article',
          Parameters: 'Article ID to patch',
          'Request body requires': {
            inc_votes: 'Amount to increment `votes` in DB',
          },
        },
        DELETE: {
          Returns: 'Nothing',
          Parameters: 'Article ID to delete',
        },
      },
      '/api/articles/:article_id/comments': {
        GET: {
          Returns: 'An array of comment objects for given Article ID',
          Parameters: 'Article ID',
        },
        POST: {
          Returns: 'The posted Article',
          Parameters: 'Article ID to patch',
          'Request body requires': {
            username: 'author of comment',
            body: 'body of comment',
          },
        },
      },
      '/api/comments/:comment_id': {
        PATCH: {
          Returns: 'The updated comment',
          Parameters: 'Comment ID to patch',
          'Request body requires': {
            inc_votes: 'Amount to increment `votes` in DB',
          },
        },
        DELETE: {
          Returns: 'Nothing',
          Parameters: 'Comment ID to delete',
        },
      },
    },
  };

  return apiJSON;
};

module.exports = { fetchApiEndpoints };

/*
  
  
},
*/
