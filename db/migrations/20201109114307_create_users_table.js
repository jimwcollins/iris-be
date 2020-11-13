const users = require('../data/development-data/users');

exports.up = function (knex) {
  return knex.schema.createTable('users', (usersTable) => {
    usersTable.text('username').primary();
    usersTable.text('avatar_url');
    usersTable.text('name').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
