import { createStore } from 'vuex'

const state = () => {
  const s = {
  }
  return s
}

const mutations = {
}

const actions = {
}

const getters = {
}

if (module.hot) {
  module.hot.accept([actions, mutations], () => {
    store.hotUpdate({
      actions,
      mutations,
    })
  })
}

export function _createStore() {
  return createStore({
    state,
    mutations,
    actions,
    getters,
  })
}
