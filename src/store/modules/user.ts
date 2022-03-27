export interface userStateType {
  token: string;
  simpleUserData: simpleUserDataType;
  userData: userDataType;
  isLoading: boolean;
}

interface simpleUserDataType {
  id: string,
  loginname: string,
  avatar_url: string,
}

export interface userDataType {
  avatar_url: string;
  create_at: string;
  githubUsername: string;
  loginname: string;
  recent_replies: recentDataItemType[];
  recent_topics: recentDataItemType[];
  score: number;
}

interface recentDataItemType {
  author: {
    avatar_url: string;
    loginname: string;
  };
  id: string;
  last_reply_at: string;
  title: string;
}

export default {
  namespaced: true,
  state: {
    token: '',
    simpleUserData: {},
    userData: {},
    isLoading: false,
  },
  mutations: {
    updateToken (state: userStateType, token: string): void {
      state.token = token
    },
    updateSimpleUserData (state: userStateType, simpleUserData: simpleUserDataType): void {
      state.simpleUserData = simpleUserData
    },
    updateUserData (state: userStateType, userData: userDataType): void {
      state.userData = userData
    },
    updateLoading (state: userStateType, isLoading: boolean): void {
      state.isLoading = isLoading
    }
  }
}