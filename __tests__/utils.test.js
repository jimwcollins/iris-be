process.env.NODE_ENV = 'test';

const {
  dateFormatter,
  getArticleRef,
  formatComment,
} = require('../db/utils/data-manipulation.js');

describe('dateFormatter()', () => {
  it('Returns article data in the right format', () => {
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
        created_at: '2018-11-15T12:21:54.171Z',
        votes: 100,
      },
    ];
    expect(dateFormatter(input)).toEqual(expectedOuput);
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
});

describe('formatComment()', () => {
  it('formats a single comment with article Id', () => {
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
        created_at: 1511354163389,
      },
    ];
    expect(formatComment(input, articleRef)).toEqual(expectedOutput);
  });
});
