const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { configureStore } = require('@reduxjs/toolkit');

function load(file, mocks = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(code, {
    exports, process: { env: {} },
    require: (id) => id in mocks ? mocks[id] : require(id),
  });
  return exports;
}
const service = load('src/services/authService.ts');
const session = (time = Date.now()) => ({
  token: `mock-token-1-${time}`,
  user: { id: '1', name: 'Test', email: 'test@example.com' },
});
function setup(raw, failStorage = false) {
  const storage = {
    async getItem() { if (failStorage) throw Error('Storage unavailable'); return raw; },
    async setItem(key, value) { if (failStorage) throw Error('Write failed'); raw = value; },
    async removeItem() { if (failStorage) throw Error('Remove failed'); raw = null; },
  };
  const slice = load('src/store/uthSlice.ts', {
    '@react-native-async-storage/async-storage': { __esModule: true, default: storage },
    '../services/authService': service,
  });
  const store = configureStore({ reducer: { auth: slice.default } });
  return { store, slice, stored: () => raw };
}

test('session validity rejects expired, future, malformed and mismatched tokens', () => {
  const now = Date.now();
  assert(service.isSessionValid(session(now), now));
  assert(!service.isSessionValid(session(now - service.SESSION_MAX_AGE_MS), now));
  assert(!service.isSessionValid(session(now + 1), now));
  assert(!service.isSessionValid({ ...session(), token: 'anything' }, now));
  assert(!service.isSessionValid({ ...session(), user: { ...session().user, id: '2' } }, now));
});
test('startup restores a valid stored session', async () => {
  const { store, slice } = setup(JSON.stringify(session()));
  await store.dispatch(slice.restoreSession());
  assert(store.getState().auth.isLoggedIn);
  assert(store.getState().auth.isReady);
});
test('startup removes expired and corrupt data and handles unavailable storage', async () => {
  for (const raw of ['broken json', JSON.stringify(session(Date.now() - service.SESSION_MAX_AGE_MS))]) {
    const app = setup(raw);
    await app.store.dispatch(app.slice.restoreSession());
    assert(!app.store.getState().auth.isLoggedIn);
    assert(app.store.getState().auth.isReady);
    assert.equal(app.stored(), null);
  }
  const app = setup(null, true);
  await app.store.dispatch(app.slice.restoreSession());
  assert(app.store.getState().auth.isReady);
  assert(!app.store.getState().auth.isLoggedIn);
});
test('login persists session; logout clears storage and Redux', async () => {
  const app = setup(null);
  await app.store.dispatch(app.slice.loginSuccess(session()));
  assert(app.stored());
  assert(app.store.getState().auth.isLoggedIn);
  await app.store.dispatch(app.slice.logout());
  assert.equal(app.stored(), null);
  assert.equal(app.store.getState().auth.token, null);
  assert.equal(app.store.getState().auth.user, null);
  assert(!app.store.getState().auth.isLoggedIn);
});
test('failed persistence does not log the user in', async () => {
  const app = setup(null, true);
  await assert.rejects(app.store.dispatch(app.slice.loginSuccess(session())));
  assert(!app.store.getState().auth.isLoggedIn);
});

const Redirect = 'Redirect';
function render(file, auth, params = {}) {
  const component = load(file, {
    react: { useState: (value) => [value, () => {}], useRef: (value) => ({ current: value }) },
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) },
    'expo-router': { Redirect, useLocalSearchParams: () => params },
    'react-native': { StyleSheet: { create: (styles) => styles }, Platform: { OS: 'web' } },
    'react-native-safe-area-context': {},
    '@/components/themed-text': {}, '@/components/themed-view': {},
    '@/store': { useAppSelector: (select) => select({ auth }), useAppDispatch: () => () => {} },
    '@/services/authService': service, '@/store/uthSlice': {}, '@/utils/validation': {
      validateEmail: () => true, validatePassword: () => true,
    },
    '@/utils/auth-destination': load('src/utils/auth-destination.ts'),
  }).default;
  return component();
}
test('guest Checkout redirects to login with return destination; signed-in Checkout renders', () => {
  const guest = render('src/app/checkout.tsx', { isLoggedIn: false });
  assert.equal(guest.type, Redirect);
  assert.equal(guest.props.href.pathname, '/auth');
  assert.equal(guest.props.href.params.returnTo, '/checkout');
  assert.notEqual(render('src/app/checkout.tsx', { ...session(), isLoggedIn: true }).type, Redirect);
  assert.equal(render('src/app/checkout.tsx', {
    ...session(Date.now() - service.SESSION_MAX_AGE_MS), isLoggedIn: true,
  }).type, Redirect);
});
test('successful login returns to Checkout; normal login and unknown destinations go Home', () => {
  const auth = { ...session(), isLoggedIn: true };
  assert.equal(render('src/app/auth.tsx', auth, { returnTo: '/checkout' }).props.href, '/checkout');
  assert.equal(render('src/app/auth.tsx', auth).props.href, '/');
  assert.equal(render('src/app/auth.tsx', auth, { returnTo: 'https://example.com' }).props.href, '/');
});
