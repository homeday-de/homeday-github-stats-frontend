<template>
  <section class="repositories-picker text-center">
    <SpeechBubble
      :size="80"
      :mood="kawaiiMood"
      :class="kawaiiClass"
      color="#F8BBD0"
    />
    <h1 class="display-1 mt-4">
      Nice to see you today!
    </h1>
    <p class="body-1 font-italic mt-2">
      To get started, press the nice shiny button below.
    </p>
    <v-dialog v-model="repositoriesDialogOpen" scrollable max-width="500px">
      <template v-slot:activator="{ on }">
        <v-btn
          color="pink lighten-2"
          v-on="on"
          class="white--text mt-5"
          @mouseenter="setKawaiiMood('blissful')"
          @mouseleave="setKawaiiMood('happy')"
        >
          <v-icon left>mdi-source-repository-multiple</v-icon>
          Choose repositories
        </v-btn>
      </template>
      <v-card>
        <template v-if="fetchingRepositories">
          <v-card-title>Loading repositories</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div class="d-flex mt-4">
              <v-progress-circular
                :size="36"
                indeterminate
                class="mx-auto"
                color="pink lighten-2"
              ></v-progress-circular>
            </div>
          </v-card-text>
        </template>
        <template v-else>
          <v-card-title>Select repositories</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <template v-if="repositories.length">
              <v-checkbox
                v-for="repository in repositories"
                :key="repository.id"
                v-model="selectedRepositories"
                :hide-details="true"
                :light="false"
                :value="repository.id"
                :label="repository.full_name"
                color="pink lighten-2"
              ></v-checkbox>

              <v-btn
                class="mt-8"
                @click="getRepositoriesList({ force: true })"
              >Refresh the list</v-btn>
            </template>
            <p
              v-else
              class="mt-4"
            >
              No repositories found
            </p>
          </v-card-text>
        </template>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="pink lighten-2"
            text
            @click="repositoriesDialogOpen = false"
          >Close</v-btn>
          <v-btn
            :disabled="fetchingRepositories || selectedRepositories.length === 0"
            color="pink lighten-2"
            text
            @click="repositoriesDialogOpen = false; selectRepositories();"
          >{{ selectButtonText }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { SpeechBubble } from 'vue-kawaii';
import AuthService from '@/auth/authService';

export default {
  name: 'RepositoriesPicker',
  components: {
    SpeechBubble,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      repositoriesDialogOpen: false,
      repositoriesLoading: false,
      selectedRepositories: [],
      kawaiiMood: 'happy',
    };
  },
  computed: {
    ...mapState({
      fetchingRepositories: 'fetchingRepositories',
      repositories: 'repositories',
    }),
    selectButtonText() {
      if (this.selectedRepositories.length === 0) {
        return 'Select';
      }

      return this.selectedRepositories.length === 1
        ? 'Select (1) repo'
        : `Select (${this.selectedRepositories.length}) repos`;
    },
    kawaiiClass() {
      if (this.kawaiiMood !== 'blissful') {
        return '';
      }

      return 'bounce';
    },
  },
  watch: {
    repositoriesDialogOpen(repositoriesDialogOpen) {
      if (!repositoriesDialogOpen) {
        return;
      }

      if (this.repositoriesLoading === true) {
        return;
      }

      this.getRepositoriesList();
    },
  },
  methods: {
    async getRepositoriesList({ force = false } = {}) {
      if (force !== true && this.repositories.length > 0) {
        return;
      }

      const auth0 = await AuthService.getInstance();
      const authToken = await auth0.getTokenSilently();
      await this.$store.dispatch('fetchRepositories', { authToken });
    },
    setKawaiiMood(mood) {
      this.kawaiiMood = mood;
    },
    selectRepositories() {
      this.$emit('input', this.selectedRepositories);
    },
  },
};
</script>

<style lang="scss" scoped>
.bounce {
  animation-name: bounce;
  animation-duration: 2s;
  animation-timing-function: cubic-bezier(0.280, 0.840, 0.420, 1);
}

@keyframes bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(1.1, 0.9) translateY(0);
  }
  15% {
    transform: scale(.9, 1.1) translateY(-15px);
  }
  25% {
    transform: scale(1.05, 0.95) translateY(0);
  }
  30% {
    transform: scale(1, 1) translateY(-4px);
  }
  35% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
</style>
