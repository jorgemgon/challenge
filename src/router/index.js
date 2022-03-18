
const {
  createRouter,
  createMemoryHistory,
  createWebHistory,
} = require('vue-router');

const isServer = typeof window === 'undefined';

const _importPages = file => () => import('../components/pages/' + file + '.vue');

let history = isServer ? createMemoryHistory() : createWebHistory();

const routes = [
  { name: 'home', path: '/', component: _importPages('Home') }
];

export function _createRouter() {
  return createRouter({ routes, history });
}
