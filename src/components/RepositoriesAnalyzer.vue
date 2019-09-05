<template>
  <div class="repositories-analyzer">
    <div class="repositories-analyzer__controls">
      <v-row>
        <v-col cols="12" class="text-center mb-2">
          <v-btn
            text
            @click="goBack"
          >
            <v-icon left>mdi-backup-restore</v-icon>
            Back to repositories
          </v-btn>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn
            v-for="predefinedRange in predefinedRanges"
            :key="predefinedRange.value"
            class="ma-2"
            small
            outlined
            color="pink lighten-2"
            @click="setRange(predefinedRange.value)"
          >
            {{ predefinedRange.name }}
          </v-btn>
        </v-col>
        <v-col cols="12" sm="6">
          <v-menu
            ref="dateFrom"
            v-model="dateFromOpen"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dateFrom"
                label="Date from"
                prepend-icon="mdi-calendar-range"
                readonly
                v-on="on"
                color="pink lighten-2"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dateFrom"
              no-title
              scrollable
              color="pink lighten-2"
              @input="dateFromOpen = false"
            />
          </v-menu>
        </v-col>
        <v-col cols="12" sm="6">
          <v-menu
            ref="dateTo"
            v-model="dateToOpen"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dateTo"
                label="Date to"
                prepend-icon="mdi-calendar-range"
                readonly
                v-on="on"
                color="pink lighten-2"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dateTo"
              no-title
              scrollable
              color="pink lighten-2"
              @input="dateToOpen = false"
            />
          </v-menu>
        </v-col>
        <v-col cols="12" class="text-center mt-4">
          <v-btn
            :disabled="!dateFrom || !dateTo"
            color="pink lighten-2"
            class="white--text"
            @click="analyze"
          >
            <v-icon left>mdi-flask-outline</v-icon>
            Analyze
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <RepositoriesResult v-if="analyses.length > 0"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import dateStartOfQuarter from 'date-fns/startOfQuarter';
import dateEndOfQuarter from 'date-fns/endOfQuarter';
import dateSubQuarters from 'date-fns/subQuarters';
import dateStartOfMonth from 'date-fns/startOfMonth';
import dateEndOfMonth from 'date-fns/endOfMonth';
import dateSubMonths from 'date-fns/subMonths';
import dateSubDays from 'date-fns/subDays';
import dateLightFormat from 'date-fns/lightFormat';
import AuthService from '@/auth/authService';
import RepositoriesResult from '@/components/RepositoriesResult.vue';

export default {
  name: 'RepositoriesAnalyzer',
  components: {
    RepositoriesResult,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dateFromOpen: false,
      dateFrom: null,
      dateToOpen: false,
      dateTo: null,
      predefinedRanges: [
        {
          name: 'This quarter',
          value: 'this-quarter',
        },
        {
          name: 'Previous quarter',
          value: 'previous-quarter',
        },
        {
          name: 'This month',
          value: 'this-month',
        },
        {
          name: 'Previous month',
          value: 'previous-month',
        },
        {
          name: 'Last 30 days',
          value: 'last-30-days',
        },
      ],
    };
  },
  computed: {
    ...mapState({
      repositories: 'repositories',
      analyses: 'analyses',
    }),
  },
  created() {
    this.setRange('this-quarter');
  },
  methods: {
    goBack() {
      this.$emit('input', []);
      this.$store.commit('clearAnalyses');
    },
    async analyze() {
      if (!this.dateFrom || !this.dateTo) {
        return;
      }

      const auth0 = await AuthService.getInstance();
      const authToken = await auth0.getTokenSilently();

      this.value.forEach((repositoryId) => {
        const repository = this.repositories.find(
          repo => repo.id === repositoryId,
        );

        if (repository === undefined) {
          return;
        }

        this.$store.dispatch(
          'analyzeRepository',
          {
            authToken,
            user: repository.owner.login,
            repo: repository.name,
            dateFrom: new Date(this.dateFrom).getTime(),
            dateTo: new Date(this.dateTo).getTime(),
          },
        );
      });
    },
    formatDate(date) {
      return dateLightFormat(date, 'yyyy-MM-dd');
    },
    setRange(range) {
      const now = new Date();
      const nowInPreviousQuarter = dateSubQuarters(now, 1);
      const nowInPreviousMonth = dateSubMonths(now, 1);

      switch (range) {
        case ('this-quarter'):
          this.dateFrom = this.formatDate(
            dateStartOfQuarter(now),
          );
          this.dateTo = this.formatDate(
            dateEndOfQuarter(now),
          );
          break;
        case ('previous-quarter'):
          this.dateFrom = this.formatDate(
            dateStartOfQuarter(nowInPreviousQuarter),
          );
          this.dateTo = this.formatDate(
            dateEndOfQuarter(nowInPreviousQuarter),
          );
          break;
        case ('this-month'):
          this.dateFrom = this.formatDate(
            dateStartOfMonth(now),
          );
          this.dateTo = this.formatDate(
            dateEndOfMonth(now),
          );
          break;
        case ('previous-month'):
          this.dateFrom = this.formatDate(
            dateStartOfMonth(nowInPreviousMonth),
          );
          this.dateTo = this.formatDate(
            dateEndOfMonth(nowInPreviousMonth),
          );
          break;
        case ('last-30-days'):
          this.dateFrom = this.formatDate(
            dateSubDays(now, 30),
          );
          this.dateTo = this.formatDate(now);
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss">
.repositories-analyzer {

  &__controls {
    margin-left: auto;
    margin-right: auto;
    max-width: 40em;
  }
}
</style>
