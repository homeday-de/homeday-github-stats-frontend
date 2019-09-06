import { stringify as queryStringify } from 'qs';
import fetchWithRetry from 'fetch-retry';

const actions = {
  fetchRepositories({ commit }, { authToken }) {
    commit('setFetchingRepositories', true);
    return fetch(process.env.API_FETCH_REPOSITORIES_URL, {
      headers: {
        Authorization: `bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then((repositories) => {
        commit('setRepositories', repositories);
      })
      .finally(() => {
        commit('setFetchingRepositories', false);
      });
  },
  analyzeRepository(
    { commit },
    {
      authToken,
      user,
      repo,
      dateFrom,
      dateTo,
    },
  ) {
    commit('setAnalyzingRepository', {
      user,
      repo,
      inProgress: true,
      error: false,
    });
    const baseUrl = process.env.API_ANALYZE_URL;
    const params = {
      user,
      repo,
      dateFrom,
      dateTo,
    };
    const url = `${baseUrl}?${queryStringify(params)}`;
    return fetch(url, {
      headers: {
        Authorization: `bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(({ path }) => fetchWithRetry(path, {
        headers: {
          'Content-Type': 'application/json',
        },
        retryDelay: 5000,
        retryOn: (attempt, error, response) => {
          if (attempt > 20) {
            return false;
          }

          if (response.status < 300) {
            return false;
          }

          return true;
        },
      }))
      .then(res => res.json())
      .then((results) => {

        commit('setAnalyzingRepository', {
          user,
          repo,
          results,
          inProgress: false,
          error: false,
        });
      })
      .catch(() => {
        commit('setAnalyzingRepository', {
          user,
          repo,
          inProgress: false,
          error: true,
        });
      });
  },
};

export default actions;
