const topicsRouter = require('express').Router();
const { getTopic } = require('../controllers/topics');

const { sendInvalidMethod } = require('../controllers/errors');

topicsRouter.route('/').get(getTopic).all(sendInvalidMethod);

module.exports = topicsRouter;
