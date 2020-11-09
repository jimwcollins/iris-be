const {
  topicData,
  articleData,
  commentData,
  userData,
} = require('../data/index.js');

exports.seed = knex => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
    return knex("topics").insert(topicData).returning("*")
    })
    .then((topicsRows) => {
      console.log(`inserted ${topicsRows.length} topics`)
      return knex("users").insert(userData).returning("*")  
    })
    .then((usersRows) => {
    console.log(`inserted ${usersRows.length} users`)
    return knex("articles").insert(articleData).returning("*")
    })
    .then((articleRows) => {
    console.log(`inserted ${articleRows.length} article`)
  })
};
