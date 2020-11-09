const connection = require("../db/connection")

const fetchTopic = () => {
    return connection
        .select("slug", "description")
        .from('topics')
        //.then((topics) => {
            //return { topics }
    }



module.exports = {fetchTopic}