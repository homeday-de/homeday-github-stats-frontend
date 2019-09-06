<template>
  <div class="repositories-result">
    <v-container>
      <v-row justify="center">
        <v-col
          v-for="analysis in analyses"
          :key="analysis.repo"
          :lg="largeScreenColumn"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            color="blue-grey darken-4"
          >
            <v-card-title class="white--text">
              <h4>{{ analysis.user }}/{{ analysis.repo }}</h4>
            </v-card-title>
            <v-divider></v-divider>
            <div
              v-if="analysis.inProgress"
              class="text-center pt-4 pb-4"
              :style="{ 'background-color': '#fff' }"
            >
              <v-progress-circular
                :size="36"
                indeterminate
                class="mx-auto"
                color="pink lighten-2"
              ></v-progress-circular>
            </div>
            <template v-else>
              <v-list
                v-for="(results, i) in analysis.results.analyses"
                :key="results.name"
                subheader
              >
                <v-divider v-if="i !== 0"/>
                <v-subheader>{{ results.name }}</v-subheader>
                <v-list-item
                  v-for="result in results.results"
                  :key="result.name"
                >
                  <v-list-item-content>{{ result.name }}</v-list-item-content>
                  <v-list-item-content class="align-end justify-end">
                    <b class="text-right">{{ result.value }}</b>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <div
      v-if="allAnalysesLoaded"
      class="repositories-result__character text-center"
    >
      <SpeechBubble
        :size="80"
        class="bounce"
        mood="excited"
        color="#F8BBD0"
      />
      <p class="repositories-result__character__comment">
        Woohoo, looks like the results are in!
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { SpeechBubble } from 'vue-kawaii';

export default {
  name: 'RepositoriesResult',
  components: {
    SpeechBubble,
  },
  computed: {
    ...mapState({
      analyses: 'analyses',
    }),
    allAnalysesLoaded() {
      if (this.analyses.length === 0) {
        return false;
      }

      return !this.analyses.some(analysis => analysis.inProgress === true);
    },
    largeScreenColumn() {
      if (this.analyses.length < 3) {
        return 6;
      }

      if (this.analyses.length === 3) {
        return 4;
      }

      return 3;
    },
  },
};
</script>

<style lang="scss" scoped>
.repositories-result {
  position: relative;

  &__character {
    display: none;
    font-style: italic;
    left: 20px;
    position: absolute;
    top: -130px;
    transform: rotateZ(-10deg);
    width: 140px;

    @media (min-width: 60em) {
      display: block;
    }
  }
}

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
