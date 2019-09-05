<template>
  <v-app>
    <v-app-bar app color="blue-grey darken-4" dark>
      <v-toolbar-title class="headline text-uppercase d-flex align-center">
        <v-img
          class="d-inline-flex mr-3"
          src="/homeday-github-stats-logo.png"
          aspect-ratio="1"
          max-height="38"
          width="38"
        />
        <span class="font-weight-light"> GitHub Stats</span>
      </v-toolbar-title>
      <div class="flex-grow-1"></div>
      <template v-if="isAuthenticated">
        <v-menu bottom left>
          <template v-slot:activator="{ on: { click } }">
            <v-btn @click="click" text>
              <v-avatar
                class="mr-2"
                size="36px"
              >
                <img
                  v-if="user.picture"
                  :src="user.picture"
                  alt="Avatar"
                >
                <v-icon
                  v-else
                  v-text="userInitials"
                ></v-icon>
              </v-avatar>
              <span class="subtitle-1">
                {{ user.name }}
              </span>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="logOut">
              <v-list-item-title>Log out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <v-content>
      <v-container class="mt-8">
        <div
          v-if="isAuthenticationInProgress"
          class="d-flex"
        >
          <v-progress-circular
            :size="72"
            indeterminate
            class="mx-auto"
            color="pink lighten-2"
          ></v-progress-circular>
        </div>
        <Home v-else/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import AuthService from '@/auth/authService';
import Home from './views/Home.vue';

export default {
  name: 'App',
  components: {
    Home,
  },
  computed: {
    ...mapGetters([
      'isAuthenticated',
      'isAuthenticationInProgress',
    ]),
    user() {
      return this.$store.state.user;
    },
    userInitials() {
      if (!this.user) {
        return '';
      }

      return this.user.name.split(' ').map(n => n[0]).join('.');
    },
  },
  created() {
    this.checkIfAuthenticated();
  },
  methods: {
    async checkIfAuthenticated() {
      const auth0 = await AuthService.getInstance();
      const isAuthenticated = await auth0.isAuthenticated();

      if (!isAuthenticated) {
        this.$store.commit('setAuthenticationInProgress', false);
        return;
      }

      const user = await auth0.getUser();
      this.$store.commit('setUser', user);
      this.$store.commit('setAuthenticationInProgress', false);
    },
    async logOut() {
      const auth0 = await AuthService.getInstance();

      auth0.logout();
    },
  },
};
</script>
