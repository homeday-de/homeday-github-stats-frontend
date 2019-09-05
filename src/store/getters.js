const getters = {
  isAuthenticated(state) {
    return state.user !== null;
  },
  isAuthenticationInProgress(state) {
    return state.authenticationInProgress;
  },
};

export default getters;
