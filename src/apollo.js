// apollo.js

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core';
import fetch from 'cross-fetch'

// Create the apollo client
export function createApolloClient (ssr = false) {
  const httpLink = new HttpLink({
    // You should use an absolute URL here
    uri: 'http://countries.trevorblades.com/',
    fetch: fetch});

  const cache = new InMemoryCache()

  // If on the client, recover the injected state
  if (!ssr) {
    if (typeof window !== 'undefined') {
      const state = window.__APOLLO_STATE__
      if (state) {
        // If you have multiple clients, use `state.<client_id>`
        cache.restore(state.defaultClient)
      }
    }
  }

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
    ...(ssr ? {
      // Set this on the server to optimize queries when SSR
      ssrMode: true,
    } : {
      // This will temporary disable query force-fetching
      ssrForceFetchDelay: 100,
    }),
  })

  return apolloClient
}