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

      it('POST responds with "400 Invalid data" for non-existent article', () => {
        return request(app)
          .post('/api/articles/1500/comments')
          .send({
            username: 'rogersop',
            body: 'Where is Diane? Who is Diane? Who is anyone, really?',
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid data');
          });
      });

      it('POST responds with "400 Invalid data" if username not in DB', () => {
        return request(app)
          .post('/api/articles/5/comments')
          .send({
            username: 'diane',
            body: 'Where is Diane? Who is Diane? Who is anyone, really?',
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid data');
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

  describe('Testing /api/articles', () => {
    describe('GET method', () => {
      it('200 - should retrieve articles (no comment count)', () => {
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

      it('200 - should retrieve articles with comment count', () => {
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

      it('200 - should retrieve correct article details and comment count for specific article', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[3]).toHaveProperty('article_id', 9);
            expect(body.articles[3]).toHaveProperty(
              'title',
              "They're not exactly dogs, are they?"
            );
            expect(body.articles[3]).toHaveProperty(
              'body',
              'Well? Think about it.'
            );
            expect(body.articles[3]).toHaveProperty('votes', 0);
            expect(body.articles[3]).toHaveProperty('topic', 'mitch');
            expect(body.articles[3]).toHaveProperty('author', 'butter_bridge');
            expect(body.articles[3]).toHaveProperty(
              'created_at',
              '1986-11-23T12:21:54.171Z'
            );
            expect(body.articles[3]).toHaveProperty('comment_count', 2);
          });
      });

      describe('GET queries', () => {
        it('200 - should sort articles by created_at in ascending by default', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy('created_at');
            });
        });

        it('200 - should sort articles by title if specified', () => {
          return request(app)
            .get('/api/articles?sort_by=title')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy('title');
            });
        });

        it('200 - should sort articles by comment_count, descending if specified', () => {
          return request(app)
            .get('/api/articles?sort_by=comment_count&order=desc')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy('comment_count', {
                descending: true,
              });
            });
        });

        it('200 - should ignore incorrect sort and order queries', () => {
          return request(app)
            .get('/api/articles?sort=comment_count&order_by=desc')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy('created_at');
            });
        });

        it('400 - should show error message if sorted by non-existing column', () => {
          return request(app)
            .get('/api/articles?sort_by=nocolumn')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Bad request');
            });
        });

        it('200 - should ignore incorrect ordering', () => {
          return request(app)
            .get('/api/articles?order=noorder')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy('created_at');
            });
        });

        it('200 - should filter articles by author', () => {
          return request(app)
            .get('/api/articles?author=butter_bridge')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).toBe(3);
              body.articles.forEach((article) => {
                expect(article).toHaveProperty('author', 'butter_bridge');
              });
            });
        });

        it('200 - should filter articles by topic', () => {
          return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).toBe(1);
              body.articles.forEach((article) => {
                expect(article).toHaveProperty('topic', 'cats');
              });
            });
        });

        it('200 - should filter articles by topic AND author', () => {
          return request(app)
            .get('/api/articles?author=rogersop&topic=mitch')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).toBe(2);
              const result = body.articles.every((article) => {
                return (
                  article.topic === 'mitch' && article.author === 'rogersop'
                );
              });
              expect(result).toBe(true);
            });
        });

        it('200 - should return empty array for non-existing topic', () => {
          return request(app)
            .get('/api/articles?topic=notopic')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).toBe(0);
            });
        });

        it('200 - should ignore incorrect filters', () => {
          return request(app)
            .get('/api/articles?nofilter=rogersop&topi=random')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).toBe(12);
            });
        });
      });
    });

    describe('POST method', () => {
      it('201 - should post article succesfully and return new article', () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: 'Kindles: tech magic or work of the dark one?',
            body:
              'Book-lovers of the world unite to condemn this newfangled devilry. Tech-fans strike back.',
            topic: 'paper',
            author: 'rogersop',
          })
          .expect(201)
          .then(({ body }) => {
            expect(body.article).toEqual({
              article_id: 13,
              title: 'Kindles: tech magic or work of the dark one?',
              body:
                'Book-lovers of the world unite to condemn this newfangled devilry. Tech-fans strike back.',
              votes: 0,
              topic: 'paper',
              author: 'rogersop',
              created_at: expect.any(String),
            });
          });
      });

      it('400 - Should return error message if no body provided', () => {
        return request(app)
          .post('/api/articles')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid article data');
          });
      });

      it('400 - Should return error message if incomplete body provided', () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: 'Kindles: tech magic or work of the dark one?',
            body:
              'Book-lovers of the world unite to condemn this newfangled devilry. Tech-fans strike back.',
            author: 'rogersop',
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid article data');
          });
      });

      it('400 - Should return error message if incorrect body provided', () => {
        return request(app)
          .post('/api/articles')
          .send({
            not_title: 'Kindles: tech magic or work of the dark one?',
            body:
              'Book-lovers of the world unite to condemn this newfangled devilry. Tech-fans strike back.',
            topic: 'paper',
            author: 'rogersop',
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid article data');
          });
      });

      it('400 - Should return error message if author does not exist', () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: 'Kindles: tech magic or work of the dark one?',
            body:
              'Book-lovers of the world unite to condemn this newfangled devilry. Tech-fans strike back.',
            topic: 'paper',
            author: 'some_random',
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid data');
          });
      });

      it('400 - Should return error message if topic does not exist', () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: 'Kindles: tech magic or work of the dark one?',
            body:
              'Book-lovers of the world unite to condemn this newfangled devilry. Tech-fans strike back.',
            topic: 'not a topic',
            author: 'rogersop',
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid data');
          });
      });
    });
  });

  describe('Testing /api/comments/:comment_id', () => {
    describe('PATCH method', () => {
      it('200 - should increment votes and return updated comment', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 5 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).toEqual({
              comment_id: 1,
              author: 'butter_bridge',
              article_id: 9,
              votes: 21,
              created_at: '2017-11-22T12:36:03.389Z',
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            });
          });
      });

      it('200 - should decrement votes and return updated comment', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: -1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).toEqual({
              comment_id: 1,
              author: 'butter_bridge',
              article_id: 9,
              votes: 15,
              created_at: '2017-11-22T12:36:03.389Z',
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            });
          });
      });

      it("404 - returns error for comment that does't exist", () => {
        return request(app)
          .patch('/api/comments/1000')
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Comment not found');
          });
      });

      it('400 - returns error for an invalid comment ID', () => {
        return request(app)
          .patch('/api/comments/NotANumber')
          .send({ inc_votes: 10 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });

      it('400 - returns error for invalid vote data', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ wrong_key: 10 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid vote data');
          });
      });

      it('400 - returns error if vote data is not a number', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 'Not a number' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid vote data');
          });
      });

      it('400 - returns error if missing vote data', () => {
        return request(app)
          .patch('/api/comments/1')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid vote data');
          });
      });
    });

    describe('DELETE method', () => {
      it('should return 204', () => {
        return request(app).delete('/api/comments/1').expect(204);
      });

      it('204 - DELETE removes article from DB', () => {
        return request(app)
          .delete('/api/comments/1')
          .expect(204)
          .then(() => {
            return connection('comments')
              .select('*')
              .where('comment_id', '=', 1);
          })
          .then((comments) => {
            expect(comments.length).toBe(0);
          });
      });

      it("404 - returns error for comment that doesn't exist", () => {
        return request(app)
          .delete('/api/comments/1000')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Comment not found');
          });
      });

      it('400 - returns error for invalid comment ID', () => {
        return request(app)
          .delete('/api/comments/NotANumber')
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
