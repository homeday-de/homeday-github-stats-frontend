<template>
  <div>
    <div
      v-if="!isAuthenticated"
      class="text-center"
    >
      <h1 class="display-1">
        Welcome to the Github stats analyzer
      </h1>
      <p class="body-1 font-italic mt-2">
        Want to know how your team is doing?
      </p>
      <v-btn
        class="mt-5 white--text"
        color="pink lighten-2"
        @click="login"
      >
        <v-icon left>mdi-github-circle</v-icon>
        Login with Github
      </v-btn>
    </div>
    <template v-else>
      <RepositoriesPicker
        v-if="selectedRepositories.length === 0"
        v-model="selectedRepositories"
      />
      <RepositoriesAnalyzer
        v-else
        v-model="selectedRepositories"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AuthService from '@/auth/authService';
import RepositoriesPicker from '@/components/RepositoriesPicker.vue';
import RepositoriesAnalyzer from '@/components/RepositoriesAnalyzer.vue';

export default {
  name: 'Callback',
  components: {
    RepositoriesPicker,
    RepositoriesAnalyzer,
  },
  data() {
    return {
      selectedRepositories: [],
    };
  },
  computed: {
    ...mapGetters([
      'isAuthenticated',
    ]),
  },
  methods: {
    async login() {
      const user = await AuthService.login();

      this.$store.commit('setUser', user);
    },
  },
};
</script>
