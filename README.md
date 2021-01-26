# The Iris

## Back-End

A full-stack, responsive news app built using React, Express and postgreSQL.

The hosted back-end can be found here: https://iris-be.herokuapp.com/api

<BR>

The hosted site can be found here: <to come>

The front-end repo can be found here: https://github.com/jimwcollins/iris-fe

&nbsp;

## `Features`

- Tables to hold users, topics, articles and comments.
- Allows the retrieval and sorting of articles, plus creation and deletion.
- Allows the retrieval and sorting of comments, plus creation and deletion.
- Allows users to vote on articles and comments via patch requests.
- All endpoints can be retrived on the /api endpoint.
- Data on a specific user can be retrieved.
- Users can perform a fuzzy search of topics, bringing back any appropriate matches.

&nbsp;

## `Tech`

- Express server
- postgreSQL database
- Knex for seeding, migrations and database queries
- Jest, Jest Sorted and Supertest for testing
- Insomnia for querying and testing endpoints
- Hosting on heroku

&nbsp;

## `Endpoints`

- GET /api

<BR>

- GET /api/topics

<BR>

- GET /api/users/:username

<BR>

- GET /api/articles/:article_id
- PATCH /api/articles/:article_id
- DELETE /api/articles/:article_id

<BR>

- GET /api/articles/:article_id/comments
- POST /api/articles/:article_id/comments

<BR>

- GET /api/articles
- POST /api/articles

<BR>

- PATCH /api/comments/:comment_id
- DELETE /api/comments/:comment_id

&nbsp;

Endpoints send responses in the form of a JSON object, with a key name of what it is that being sent. E.g.

```json
{
  "topics": [
    {
      "description": "Code is love, code is life",
      "slug": "coding"
    },
    {
      "description": "FOOTIE!",
      "slug": "football"
    },
    {
      "description": "Hey good looking, what you got cooking?",
      "slug": "cooking"
    }
  ]
}
```

## `Future improvements`

- Implement sign-up of new users
- Allow creation of new topics
- Add images to articles

&nbsp;
