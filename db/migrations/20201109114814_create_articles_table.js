const articles = require('../data/development-data/articles');

exports.up = function (knex) {
  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id').primary();
    articlesTable.text('title').notNullable();
    articlesTable.text('body').notNullable();
    articlesTable.integer('votes').defaultTo(0);
    articlesTable.text('topic').notNullable().references('topics.slug');
    articlesTable.text('author').notNullable().references('users.username');
    articlesTable.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('articles');
};
