import Vue from 'vue';
import Vuex from 'vuex';

import { createPersistedState } from 'vuex-electron';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState(),
    // createSharedMutations(),
  ],
  strict: process.env.NODE_ENV !== 'production',
  state: {
    username: '',
  },
  mutations: {
    username(state, payload) {
      state.username = payload.username;
    },
  },
});
