const topicsRouter = require('express').Router();
const { getAllTopics, getTopicBySlug } = require('../controllers/topics');
const { sendInvalidMethod } = require('../controllers/errors');

topicsRouter.route('/').get(getAllTopics).all(sendInvalidMethod);

topicsRouter.route('/:topicSlug').get(getTopicBySlug).all(sendInvalidMethod);

module.exports = topicsRouter;
