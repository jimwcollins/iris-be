const usersRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/users');
const { sendInvalidMethod } = require('../controllers/errors');

usersRouter.route('/:username').get(getUserByUsername).all(sendInvalidMethod);

module.exports = usersRouter;
