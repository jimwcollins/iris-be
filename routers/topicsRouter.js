const { getTopic } = require("../controllers/topics")
const topicsRouter = require("express").Router();


topicsRouter.route("/").get(getTopic)

module.exports = topicsRouter;