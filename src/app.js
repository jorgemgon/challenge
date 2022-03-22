import { createSSRApp } from 'vue';
import { _createRouter } from './router';
import { _createStore } from './store';
import App from './App.vue';
import { sync } from 'vuex-router-sync';
import { createApolloClient } from './apollo';

import VueApollo from 'vue-apollo'


export function _createApp() {
  const app = createSSRApp(App),
    router = _createRouter(),
    store = _createStore();
  const apolloClient = createApolloClient()
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
  })
  
  app.component('amp-script', {
    props: {
      state: JSON
    },
    computed: {
      stateStringify() {
        return JSON.stringify(this.$props.state);
      }
    },
    template: `<script v-html="stateStringify"></script>`,
  })

  sync(store, router);
  app
    .use(router)
    .use(store);

  app.use(apolloProvider);

  return { app, router, store, apolloProvider };
}
