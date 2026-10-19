const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, mocks = {}, fetch) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(code, { exports, fetch, AbortController, process: { env: {} },
    require: (id) => id in mocks ? mocks[id] : require(id) });
  return exports;
}
const auth = load('src/services/authService.ts');
const book = { id: '1', title: 'Book', author: 'Author', genre: 'Novel', pages: 15,
  rating: 17, cover: 'https://example.com/cover.jpg', available: true };
const review = { id: '2', recordType: 'review', bookId: '1', userId: '1', userName: 'Test',
  rating: 4, comment: 'Hay', createdAt: '2026-10-19T00:00:00.000Z' };
const session = { token: 'mock-token-1-' + Date.now(), user: { id: '1', name: 'Test', email: 'test@example.com' } };
function setup(fetch) {
  const books = load('src/services/bookService.ts', {}, fetch);
  const reviews = load('src/services/reviewService.ts', { './authService': auth, './bookService': books }, fetch);
  return { books, ...reviews };
}
test('shared books collection separates review records, other books and invalid star ratings', async () => {
  const data = [book, { ...book, ...review }, { ...review, id: '3', bookId: '99' },
    { ...review, id: '4', rating: 17 }];
  const { books, reviewService, averageRating } = setup(async () => ({ ok: true, json: async () => data }));
  assert.equal((await books.bookService.getAll()).length, 1);
  const reviews = await reviewService.getByBook('1');
  assert.equal(reviews.length, 1);
  assert.equal(averageRating(reviews), 4);
  assert.equal(averageRating([]), 0);
});
test('POST uses the existing books endpoint, preserves identity and updates average from response', async () => {
  const calls = [];
  const api = setup(async (url, options) => {
    calls.push({ url, options });
    return { ok: true, json: async () => ({ id: '5', ...JSON.parse(options.body) }) };
  });
  const created = await api.reviewService.create('1', 5, '  Tuyệt vời  ', session);
  assert(calls[0].url.endsWith('/books'));
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(created.recordType, 'review');
  assert.equal(created.userName, session.user.name);
  assert.equal(created.comment, 'Tuyệt vời');
  assert.equal(api.averageRating([created, review]), 4.5);
  assert.equal(calls.length, 1);
});
test('numeric book IDs and embedded reviews from the supplied schema are supported', async () => {
  const numericBook = { ...book, id: 1, title: 'Clean Code', rating: 4.8, reviews: [
    { userId: 1, userName: 'Lonnie Larson', rating: 5, comment: 'Very good' },
    { userId: 2, userName: 'Gretchen Macejkovic', rating: 4, comment: 'Useful book' },
  ] };
  const api = setup(async (url) => ({ ok: true, json: async () => url.endsWith('/1') ? numericBook : [numericBook] }));
  assert.equal((await api.books.bookService.getAll())[0].id, '1');
  assert.equal((await api.books.bookService.getById('1')).id, '1');
  const reviews = await api.reviewService.getByBook('1');
  assert.equal(reviews.length, 2);
  assert.equal(reviews[0].userName, 'Lonnie Larson');
  assert.equal(reviews[0].userId, '1');
  assert.notEqual(reviews[0].id, reviews[1].id);
  assert.equal(api.averageRating(reviews), 4.5);
});
test('embedded reviews and POST records combine without mixing books or invalid scores', async () => {
  const data = [{ ...book, reviews: [
    { userId: 1, userName: 'Reader', rating: 5, comment: 'Great' },
    { userId: 2, userName: 'Invalid', rating: 17, comment: 'Invalid' },
  ] }, review, { ...review, id: '3', bookId: '2' }];
  const api = setup(async () => ({ ok: true, json: async () => data }));
  const reviews = await api.reviewService.getByBook('1');
  assert.equal(reviews.length, 2);
  assert.equal(api.averageRating(reviews), 4.5);
});
test('detail 404 falls back to collection with numeric ID and preserves embedded reviews', async () => {
  const calls = [];
  const controller = new AbortController();
  const numericBook = { ...book, id: 1, title: 'Clean Code', reviews: [
    { userId: 1, userName: 'Lonnie Larson', rating: 5, comment: 'Very good' },
  ] };
  const api = setup(async (url, options) => {
    calls.push({ url, signal: options.signal });
    return url.endsWith('/1') ? { ok: false, status: 404 } :
      { ok: true, json: async () => [numericBook, { ...review, ...book, recordType: 'review' }] };
  });
  const detail = await api.books.bookService.getById('1', controller.signal);
  assert.equal(detail.id, '1');
  assert.equal(detail.title, 'Clean Code');
  assert.equal(detail.reviews.length, 1);
  assert.equal(calls.length, 2);
  assert(calls[1].url.endsWith('/books'));
  assert(calls.every((call) => call.signal === controller.signal));
});
test('detail fallback still rejects genuinely missing books and does not mask server errors', async () => {
  const missing = setup(async (url) => url.endsWith('/missing') ? { ok: false, status: 404 } :
    { ok: true, json: async () => [book] });
  await assert.rejects(missing.books.bookService.getById('missing'), /Không tìm thấy sách/);
  let count = 0;
  const broken = setup(async () => { count++; return { ok: false, status: 500 }; });
  await assert.rejects(broken.books.bookService.getById('1'), /Không thể tải thông tin sách/);
  assert.equal(count, 1);
});
test('unauthenticated, expired and invalid review submissions never issue a POST', async () => {
  let count = 0;
  const api = setup(async () => { count++; throw Error('Unexpected request'); });
  for (const [rating, comment, credentials] of [
    [5, 'Hay', { ...session, token: '' }],
    [5, 'Hay', { ...session, token: 'mock-token-1-1' }],
    [0, 'Hay', session], [6, 'Hay', session], [1.5, 'Hay', session],
    [5, '   ', session], [5, 'x'.repeat(1001), session],
  ]) await assert.rejects(api.reviewService.create('1', rating, comment, credentials));
  assert.equal(count, 0);
});
test('HTTP errors and malformed POST responses reject without reporting success', async () => {
  const failed = setup(async () => ({ ok: false }));
  await assert.rejects(failed.reviewService.getByBook('1'));
  await assert.rejects(failed.reviewService.create('1', 4, 'Hay', session));
  const malformed = setup(async () => ({ ok: true, json: async () => book }));
  await assert.rejects(malformed.reviewService.create('1', 4, 'Hay', session));
});
test('login return destinations allow book details and reject external paths', () => {
  const { authDestination } = load('src/utils/auth-destination.ts');
  assert.equal(authDestination('/books/1'), '/books/1');
  assert.equal(authDestination('/checkout'), '/checkout');
  for (const value of ['https://example.com', '//example.com', '/books/../auth', ['/books/1']]) {
    assert.equal(authDestination(value), '/');
  }
});

test('review form adds the POST result and recalculates stars without reloading book or reviews', async () => {
  let getCount = 0;
  let postCount = 0;
  const api = setup(async (url, options) => {
    if (options?.method === 'POST') {
      postCount++;
      return { ok: true, json: async () => ({ id: '10', ...JSON.parse(options.body) }) };
    }
    getCount++;
    return { ok: true, json: async () => [book, review] };
  });
  const hooks = [];
  const effects = [];
  let cursor = 0;
  const jsx = (type, props) => ({ type, props });
  const { BookReviews } = load('src/components/book-reviews.tsx', {
    react: {
      useState(initial) {
        const index = cursor++;
        if (!(index in hooks)) hooks[index] = initial;
        return [hooks[index], (value) => { hooks[index] = typeof value === 'function' ? value(hooks[index]) : value; }];
      },
      useRef(initial) {
        const index = cursor++;
        return hooks[index] ??= { current: initial };
      },
      useEffect(callback) { effects.push(callback); },
    },
    'react/jsx-runtime': { jsx, jsxs: jsx },
    'expo-router': { router: { push() { throw Error('Unexpected navigation'); } } },
    'react-native': { StyleSheet: { create: (value) => value }, View: 'View',
      Pressable: 'Pressable', TextInput: 'TextInput', ActivityIndicator: 'Loading' },
    './themed-text': { ThemedText: 'Text' }, './themed-view': { ThemedView: 'View' },
    './rating-stars': { RatingStars: 'RatingStars' },
    '@/services/reviewService': api, '@/services/authService': auth,
    '@/store': { useAppSelector: (select) => select({ auth: { ...session, isLoggedIn: true } }) },
    '@/hooks/use-theme': { useTheme: () => ({ text: '#000', textSecondary: '#555' }) },
  });
  function render() { cursor = 0; return BookReviews({ bookId: '1' }); }
  function nodes(tree) {
    if (!tree || typeof tree !== 'object') return [];
    if (Array.isArray(tree)) return tree.flatMap(nodes);
    return [tree, ...nodes(tree.props?.children)];
  }
  const flush = () => new Promise((resolve) => setImmediate(resolve));
  render();
  effects.shift()();
  await flush();
  let tree = render();
  nodes(tree).find((node) => node.type === 'RatingStars' && node.props.onChange).props.onChange(5);
  nodes(tree).find((node) => node.type === 'TextInput').props.onChangeText('Excellent');
  tree = render();
  nodes(tree).find((node) => node.type === 'Pressable' &&
    node.props.children?.props?.children === 'Gửi đánh giá').props.onPress();
  await flush();
  tree = render();
  assert(nodes(tree).some((node) => node.type === 'Text' && node.props.children === 'Excellent'));
  assert(nodes(tree).some((node) => node.type === 'RatingStars' && node.props.value === 4.5));
  assert.equal(nodes(tree).find((node) => node.type === 'TextInput').props.value, '');
  assert.equal(getCount, 1);
  assert.equal(postCount, 1);
});
