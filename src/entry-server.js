import { _createApp } from './app';

import * as ApolloSSR from '@vue/apollo-ssr'

export default async ssrContext => {
    const { app, router, store, apolloProvider } = _createApp();
    const { url } = ssrContext;

    router.push(url);

    await router.isReady().then(()=> {
            // This `rendered` hook is called when the app has finished rendering
            ssrContext.rendered = () => {
                // After the app is rendered, our store is now
                // filled with the state from our components.
                // When we attach the state to the context, and the `template` option
                // is used for the renderer, the state will automatically be
                // serialized and injected into the HTML as `window.__INITIAL_STATE__`.
                ssrContext.state = store.state
    
                // ALso inject the apollo cache state
                ssrContext.apolloState = ApolloSSR.getStates(apolloProvider.clients)
            }
    });

    return app;
    
}