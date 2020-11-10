const topicsRouter = require('express').Router();
const { getTopic } = require('../controllers/topics');

topicsRouter.route('/').get(getTopic);

module.exports = topicsRouter;
