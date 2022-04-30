import { createStore } from 'vuex';
import grobal from './modules/grobal';
import user from './modules/user';

export default createStore({
  modules: {
    grobal,
    user,
  }
})
