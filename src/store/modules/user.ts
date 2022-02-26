interface userStateType {
  token: string;
}

export default {
  namespaced: true,
  state: {
    token: ''
  },
  mutations: {
    updateToken (state: userStateType, token: string): void {
      state.token = token
    }
  }
}