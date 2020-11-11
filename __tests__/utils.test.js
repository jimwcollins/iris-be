process.env.NODE_ENV = 'test';

const {
  getTimestamp,
  formatArticles,
  getArticleRef,
  formatComments,
} = require('../db/utils/data-manipulation.js');

describe('getTimestamp()', () => {
  it('Returns a timestamp in the right format', () => {
    const timeIn = 1542284514171;
    const expectedOutput = new Date(timeIn);
    const actualOutput = getTimestamp(timeIn);
    expect(actualOutput).toStrictEqual(expectedOutput);
  });
});

describe('formatArticles()', () => {
  it('Returns article data in the right format for single object in array', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    const expectedOuput = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: new Date(1542284514171),
        votes: 100,
      },
    ];
    const actualOutput = formatArticles(input);
    expect(actualOutput).toEqual(expectedOuput);
  });

  it('Returns article data in the right format for multiple objects in array', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      },
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171,
      },
    ];
    const expectedOuput = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: new Date(1542284514171),
        votes: 100,
      },
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: new Date(1289996514171),
      },
    ];
    const actualOutput = formatArticles(input);
    expect(actualOutput).toEqual(expectedOuput);
  });

  it('Does not mutate original input', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    const expectedInput = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    formatArticles(input);
    expect(input).toEqual(expectedInput);
  });
});

describe('getArticleRef()', () => {
  it('when passed a single object in an array, returns the title and article Id', () => {
    const input = [
      {
        article_id: 9,
        title: 'Learn HTML5, CSS3, and Responsive WebSite Design in One Go',
        body: 'Test',
        votes: 0,
        topic: 'coding',
        author: 'grumpy19',
        created_at: '2017-03-06T02:22:14.447Z',
      },
    ];
    const expectedOutput = {
      'Learn HTML5, CSS3, and Responsive WebSite Design in One Go': 9,
    };
    expect(getArticleRef(input)).toEqual(expectedOutput);
  });

  it('when passed multiple objects in an array, returns correct ref object', () => {
    const input = [
      {
        article_id: 9,
        title: 'Learn HTML5, CSS3, and Responsive WebSite Design in One Go',
        body: 'Test',
        votes: 0,
        topic: 'coding',
        author: 'grumpy19',
        created_at: '2017-03-06T02:22:14.447Z',
      },
      {
        article_id: 3,
        title: 'Test title',
        body: 'Test body',
        votes: 0,
        topic: 'coding',
        author: 'grumpy19',
        created_at: '2017-03-06T02:22:14.447Z',
      },
    ];
    const expectedOutput = {
      'Learn HTML5, CSS3, and Responsive WebSite Design in One Go': 9,
      'Test title': 3,
    };
    expect(getArticleRef(input)).toEqual(expectedOutput);
  });
});

describe('formatComments()', () => {
  it('formats a single comment', () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const articleRef = {
      "They're not exactly dogs, are they?": 9,
    };
    const expectedOutput = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 9,
        author: 'butter_bridge',
        votes: 16,
        created_at: new Date(1511354163389),
      },
    ];
    expect(formatComments(input, articleRef)).toEqual(expectedOutput);
  });

  it('formats multiple comments', () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389,
      },
    ];
    const articleRef = {
      "They're not exactly dogs, are they?": 9,
      'Living in the shadow of a great man': 4,
    };
    const expectedOutput = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 9,
        author: 'butter_bridge',
        votes: 16,
        created_at: new Date(1511354163389),
      },
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        article_id: 4,
        author: 'butter_bridge',
        votes: 14,
        created_at: new Date(1479818163389),
      },
    ];
    expect(formatComments(input, articleRef)).toEqual(expectedOutput);
  });

  it('does not mutate original array', () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const articleRef = {
      "They're not exactly dogs, are they?": 9,
    };
    const expectedInput = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    formatComments(input, articleRef);
    expect(input).toEqual(expectedInput);
  });
});
