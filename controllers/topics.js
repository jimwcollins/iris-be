const { fetchTopic } = require("../models/topics")


exports.getTopic = (req, res, next) => {
    fetchTopic().then((topics) => {
    res.status(200).send(topics)
    })
    
   
}



