process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const connection = require('../db/connection');

describe('NC_News API', () => {
  afterAll(() => {
    return connection.destroy();
  });

  beforeEach(() => {
    return connection.seed.run();
  });

  describe('Testing the topics api', () => {
    it('GET responds with a 200 ok and correct topics array', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).toEqual(expect.any(Array));
          expect(Object.keys(body.topics[0])).toEqual(
            expect.arrayContaining(['slug', 'description'])
          );
        });
    });
  });

  describe('Testing /api/users/:username', () => {
    it('GET responds with 200 ok and correct user object', () => {
      return request(app)
        .get('/api/users/icellusedkars')
        .expect(200)
        .then(({ body }) => {
          expect(typeof body.user).toBe('object');
          expect(body.user).toHaveProperty('username', 'icellusedkars');
          expect(body.user).toHaveProperty(
            'avatar_url',
            'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
          );
          expect(body.user).toHaveProperty('name', 'sam');
        });
    });

    it('GET responds with 404 for incorrect user', () => {
      return request(app)
        .get('/api/users/notauser')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('No user found');
        });
    });
  });

  describe('Testing /api/articles/:article_id', () => {
    describe('GET method', () => {
      it('GET responds with 200 ok and correct article object', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({ body }) => {
            expect(body.article).toHaveProperty('author', 'butter_bridge');
            expect(body.article).toHaveProperty(
              'title',
              'Living in the shadow of a great man'
            );
            expect(body.article).toHaveProperty('article_id', 1);
            expect(body.article).toHaveProperty(
              'body',
              'I find this existence challenging'
            );
            expect(body.article).toHaveProperty('topic', 'mitch');
            expect(body.article).toHaveProperty(
              'created_at',
              '2018-11-15T12:21:54.171Z'
            );
            expect(body.article).toHaveProperty('votes', 100);
            expect(body.article).toHaveProperty('comment_count', 13);
          });
      });

      it('GET responds with 400 "Bad request" for invalid article ID', () => {
        return request(app)
          .get('/api/articles/Notanumber')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });

      it('GET responds with 404 "No user found" for article that doesn\'t exist', () => {
        return request(app)
          .get('/api/articles/1000')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Article not found');
          });
      });
    });

    describe('DELETE method', () => {
      it('DELETE responds with 204 for succesful deletion', () => {
        return request(app).delete('/api/articles/1').expect(204);
      });

      it('DELETE responds with 204 and removes article from DB', () => {
        return request(app)
          .delete('/api/articles/1')
          .expect(204)
          .then(() => {
            return connection('articles')
              .select('*')
              .where('article_id', '=', 1);
          })
          .then((articles) => {
            expect(articles.length).toBe(0);
          });
      });

      it('DELETE removes article from DB and deletes associated comments', () => {
        return request(app)
          .delete('/api/articles/1')
          .expect(204)
          .then(() => {
            return connection('comments')
              .select('*')
              .where('article_id', '=', 1);
          })
          .then((comments) => {
            expect(comments.length).toBe(0);
          });
      });

      it("DELETE returns 404 for an article that does't exist", () => {
        return request(app)
          .delete('/api/articles/1000')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Article not found');
          });
      });

      it('DELETE returns 400 for an invalid article ID', () => {
        return request(app)
          .delete('/api/articles/NotANumber')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });
    });
  });

  describe('/missingRoute', () => {
    it('status 404 - All methods', () => {
      const allMethods = ['get', 'post', 'delete', 'patch', 'put'];
      const methodPromises = allMethods.map((method) => {
        return request(app)
          [method]('/missingRoute')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Route not found');
          });
      });
      return Promise.all(methodPromises);
    });
  });
});
