import Vue from 'vue';

const mutations = {
  setUser(state, user) {
    Vue.set(state, 'user', user);
  },
  setAuthenticationInProgress(state, authenticationInProgress) {
    Vue.set(state, 'authenticationInProgress', authenticationInProgress);
  },
  setRepositories(state, repositories) {
    Vue.set(state, 'repositories', repositories);
  },
  setFetchingRepositories(state, fetchingRepositories) {
    Vue.set(state, 'fetchingRepositories', fetchingRepositories);
  },
  setAnalyzingRepository(state, {
    user,
    repo,
    inProgress = true,
    error = false,
    results = {},
  }) {
    const analysisIndex = state.analyses.findIndex(
      analysis => analysis.user === user && analysis.repo === repo,
    );

    if (analysisIndex === -1) {
      state.analyses.push({
        user,
        repo,
        inProgress,
        error,
        results,
      });
      return;
    }

    Vue.set(state.analyses, analysisIndex, {
      user,
      repo,
      inProgress,
      error,
      results,
    });
  },
  clearAnalyses(state) {
    Vue.set(state, 'analyses', []);
  },
};

export default mutations;
