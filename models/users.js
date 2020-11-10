const connection = require('../db/connection');

const fetchUserByUsername = (username) => {
  return connection('users')
    .select('*')
    .where('username', '=', username)
    .then(([returnedUser]) => {
      if (!returnedUser)
        return Promise.reject({ status: 404, msg: 'No user found' });

      return {
        user: returnedUser,
      };
    });
};

module.exports = { fetchUserByUsername };
