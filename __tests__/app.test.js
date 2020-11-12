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

    describe('PATCH method', () => {
      it('PATCH returns 200', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 1 })
          .expect(200);
      });

      it('PATCH returns 200 and increments article votes', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 10 })
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
            expect(body.article).toHaveProperty('votes', 110);
          });
      });

      it('PATCH returns 200 and decrements article votes', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: -50 })
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
            expect(body.article).toHaveProperty('votes', 50);
          });
      });

      it("PATCH returns 404 for an article that does't exist", () => {
        return request(app)
          .patch('/api/articles/1000')
          .send({ inc_votes: 10 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Article not found');
          });
      });

      it('PATCH returns 400 for an invalid article ID', () => {
        return request(app)
          .patch('/api/articles/NotANumber')
          .send({ inc_votes: 10 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });

      it('PATCH returns error message for invalid patch data', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ wrong_key: 10 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid patch data');
          });
      });

      it('PATCH returns error message if no patch data provided', () => {
        return request(app)
          .patch('/api/articles/1')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid patch data');
          });
      });

      it('PATCH returns error message if vote update in incorrect format', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 'Not a number' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid patch data');
          });
      });
    });
  });

  describe('Testing /api/articles/:article_id/comments', () => {
    describe('POST method', () => {
      it('POST responds with 201 and new comment', () => {
        return request(app)
          .post('/api/articles/5/comments')
          .send({
            username: 'rogersop',
            body: 'Where is Diane? Who is Diane? Who is anyone, really?',
          })
          .expect(201)
          .then(({ body }) => {
            expect(body.comment).toHaveProperty('comment_id', 19);
            expect(body.comment).toHaveProperty('author', 'rogersop');
            expect(body.comment).toHaveProperty('article_id', 5);
            expect(body.comment).toHaveProperty('votes', 0);
            expect(body.comment).toHaveProperty('created_at');
            expect(body.comment).toHaveProperty(
              'body',
              'Where is Diane? Who is Diane? Who is anyone, really?'
            );
          });
      });

      it('POST responds with "404 Invalid ID or user" for non-existent article', () => {
        return request(app)
          .post('/api/articles/1500/comments')
          .send({
            username: 'rogersop',
            body: 'Where is Diane? Who is Diane? Who is anyone, really?',
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid ID or user');
          });
      });

      it('POST responds with "404 Invalid ID or user" if username not in DB', () => {
        return request(app)
          .post('/api/articles/5/comments')
          .send({
            username: 'diane',
            body: 'Where is Diane? Who is Diane? Who is anyone, really?',
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid ID or user');
          });
      });

      it('POST returns error message for invalid username key', () => {
        return request(app)
          .post('/api/articles/5/comments')
          .send({
            user: 'rogersop',
            body: 'Where is Diane? Who is Diane? Who is anyone, really?',
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid username data');
          });
      });

      it('POST returns error message for invalid body key', () => {
        return request(app)
          .post('/api/articles/5/comments')
          .send({
            username: 'rogersop',
            notbody: 'Where is Diane? Who is Diane? Who is anyone, really?',
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid body data');
          });
      });

      it('POST returns error message for missing body', () => {
        return request(app)
          .post('/api/articles/5/comments')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid post data');
          });
      });

      it('POST returns error message for incorrect username format', () => {
        return request(app)
          .post('/api/articles/5/comments')
          .send({
            username: 42,
            body: 'Where is Diane? Who is Diane? Who is anyone, really?',
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid username data');
          });
      });
    });

    describe('GET method', () => {
      it('GET should return 200 and an array of comments', () => {
        return request(app)
          .get('/api/articles/5/comments')
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.comments)).toBe(true);
            expect(body.comments.length).toBe(2);
            body.comments.forEach((comment) => {
              expect(comment).toEqual({
                comment_id: expect.any(Number),
                author: expect.any(String),
                article_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                body: expect.any(String),
              });
            });
          });
      });

      it('should throw an error for incorrect user ID', () => {
        return request(app)
          .get('/api/articles/5000/comments')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('No articles found with this ID');
          });
      });

      it('should inform user if there are no comments for this article', () => {
        return request(app)
          .get('/api/articles/3/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBe('No comments found for this article');
          });
      });

      describe('GET method with sorting and queries', () => {
        it('should sort comments by "created_at" in ascending order as default', () => {
          return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).toBeSortedBy('created_at');
            });
        });

        it('should sort comments by sort_by query if specified', () => {
          return request(app)
            .get('/api/articles/1/comments?sort_by=votes')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).toBeSortedBy('votes');
            });
        });

        it('should show error message if sorted by non-existing column', () => {
          return request(app)
            .get('/api/articles/1/comments?sort_by=nocolumn')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Bad request');
            });
        });

        it('should sort comments in descending order if specified', () => {
          return request(app)
            .get('/api/articles/1/comments?order=desc')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).toBeSortedBy('created_at', {
                descending: true,
              });
            });
        });

        it('should sort comments by both sort_by and order', () => {
          return request(app)
            .get('/api/articles/1/comments?sort_by=comment_id&order=desc')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).toBeSortedBy('comment_id', {
                descending: true,
              });
            });
        });

        it('should ignore invalid queries', () => {
          return request(app)
            .get('/api/articles/1/comments?sort=comment_id&order_by=desc')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).toBeSortedBy('created_at');
            });
        });
      });
    });
  });

  describe.only('Testing /api/articles', () => {
    describe('GET method', () => {
      it('should return 200 and retrieve articles (no comment count)', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body).toHaveProperty('articles');
            expect(Array.isArray(body.articles)).toBe(true);
            expect(body.articles.length).toBe(12);
            body.articles.forEach((article) => {
              expect(article).toMatchObject({
                article_id: expect.any(Number),
                title: expect.any(String),
                body: expect.any(String),
                votes: expect.any(Number),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
              });
            });
          });
      });

      it('should return 200 and retrieve articles with comment count', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body).toHaveProperty('articles');
            expect(Array.isArray(body.articles)).toBe(true);
            expect(body.articles.length).toBe(12);
            body.articles.forEach((article) => {
              expect(article).toEqual({
                article_id: expect.any(Number),
                title: expect.any(String),
                body: expect.any(String),
                votes: expect.any(Number),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                comment_count: expect.any(Number),
              });
            });
          });
      });

      it('should return 200 and retrieve correct article details and comment count for specific article', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            console.log(body.articles[5]);
            expect(body.articles[5]).toHaveProperty('article_id', 9);
            expect(body.articles[5]).toHaveProperty(
              'title',
              "They're not exactly dogs, are they?"
            );
            expect(body.articles[5]).toHaveProperty(
              'body',
              'Well? Think about it.'
            );
            expect(body.articles[5]).toHaveProperty('votes', 0);
            expect(body.articles[5]).toHaveProperty('topic', 'mitch');
            expect(body.articles[5]).toHaveProperty('author', 'butter_bridge');
            expect(body.articles[5]).toHaveProperty(
              'created_at',
              '1986-11-23T12:21:54.171Z'
            );
            expect(body.articles[5]).toHaveProperty('comment_count', 2);
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
