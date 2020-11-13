const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter');
const usersRouter = require('./usersRouter');
const articlesRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter');

const { getApiEndpoints } = require('../controllers/api');
const { sendInvalidMethod } = require('../controllers/errors');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

apiRouter.route('/').get(getApiEndpoints).all(sendInvalidMethod);

module.exports = apiRouter;
