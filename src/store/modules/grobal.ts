export interface grobalStateType {
  entryUrl: string;
}

export default {
  namespaced: true,
  state: {
    entryUrl: '',
  },
  mutations: {
    updateEntryUrl (state: grobalStateType, entryUrl: string): void {
      state.entryUrl = entryUrl
    }
  }
}