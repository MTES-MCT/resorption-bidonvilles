<template>
  <div class="border-1 border-cardBorder rounded-lg bg-blue100 py-1 w-64 mr-10">
    <div class="flex px-4 customHeight mb-2">
      <div class="text-primary text-xl mr-4" style="opacity: 0.4">
        <Icon v-if="cardStats.id === 'population'" class="fa-lg" :icon="icon" />
        <Icon v-else :icon="icon" />
      </div>
      <div>
        <div class="font-bold text-primary text-xl -mb-1">
          <span>
            {{ formatStat(cardStats.data.slice(-1)[0].figure) }}
          </span>
        </div>
        <p class="leading-tight">
          {{ cardStats.label }}<br />
          <span v-if="cardStats.figure_secondary">
            <span v-if="cardStats.id === 'population'" class="text-xs">
              (toutes origines) <br />
            </span>
            {{ cardStats.label_secondary }}
            <span class="text-primary font-bold">
              {{ formatStat(cardStats.figure_secondary) }}
            </span>
            {{ cardStats.label_tertiary }} <br />
          </span>
          <span v-if="cardStats.id === 'population'" class="text-xs">
            (toutes tailles)
          </span>
        </p>
        <p v-if="cardStats.id === 'closed'">hors résorption</p>
        <p v-if="['resorbed', 'closed'].includes(cardStats.id)" class="text-xs">
          depuis
          {{ cardStats.id === "closed" ? "janvier 2019" : "sept 2020" }}
        </p>
      </div>
    </div>
    <span class="block h-px bg-blue300"></span>
    <div class="customHeight flex flex-col justify-end mt-2">
      <div v-if="isFigureForConnectedUser" class="text-xs text-center">
        {{ formatStat(displayFigure.figure) }} du
        {{ displayFigure.dateFrom }} au
        {{ displayFigure.date }}
      </div>
      <div v-else-if="displayFigure !== null" class="text-xs text-center">
        {{ formatStat(displayFigure.figure) }} au
        {{ displayFigure.date }}
      </div>
      <div class="flex justify-center items-end mt-2">
        <div
          v-for="(stat, index) in columns"
          :key="index"
          @mouseenter="onMouseOver(stat)"
          @mouseleave="onMouseLeave()"
        >
          <Bar
            :height="stat.height"
            :color="stat.color"
            :hoverColor="stat.hoverColor"
          ></Bar>
        </div>
      </div>
      <div class="text-center mt-4">
        <div :class="evolutionColor">
          <Icon
            class="up"
            v-if="isEvolutionPositive"
            icon="arrow-alt-circle-right"
          />
          <Icon class="down" v-else icon="arrow-alt-circle-right" />
          <span class="ml-2 align-top">
            {{ isEvolutionPositive ? "+" : "-" }}
            {{ Math.abs(cardStats.evolution) }} %
            <span class="text-xs">en 3 mois</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bar from "./Bar.vue";

const MAX_HEIGHT = 50;

export default {
  components: {
    Bar,
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    cardStats: {
      type: Object,
    },
  },
  data() {
    return {
      isConnectedUserCardStats: this.cardStats.id === "connectedUsers",
      isEvolutionPositive: this.cardStats.evolution >= 0,
      columns: [],
      maxNumber: 0,
      hover: false,
      displayFigure: null,
    };
  },
  mounted() {
    this.maxNumber = Math.max(...this.figures);
    this.setColumns();
  },

  methods: {
    onMouseOver(value) {
      this.displayFigure = {
        figure: value.figure,
        date: value.date,
        dateFrom: value.dateFrom,
      };
    },
    onMouseLeave() {
      this.displayFigure = null;
    },
    formatStat(number) {
      return new Intl.NumberFormat("fr-FR").format(number);
    },
    setColumns() {
      if (this.maxNumber !== 0) {
        this.columns = [
          ...this.cardStats.data.slice(0, -1).map((stat) => {
            return {
              figure: stat.figure,
              height: (stat.figure * MAX_HEIGHT) / this.maxNumber,
              date: stat.formatedDate,
              dateFrom: stat.formatedDateFrom,
              color: "bg-blue600",
              hoverColor: "bg-blue400",
            };
          }),
          {
            height:
              (this.cardStats.data.slice(-1)[0].figure * MAX_HEIGHT) /
              this.maxNumber,
            date: this.cardStats.data.slice(-1)[0].formatedDate,
            dateFrom: this.cardStats.data.slice(-1)[0].formatedDateFrom,
            figure: this.cardStats.data.slice(-1)[0].figure,
            color: this.cardStats.color === "red" ? "bg-red" : "bg-green500",
            hoverColor:
              this.cardStats.color === "red" ? "bg-red400" : "bg-green400",
          },
        ];
      }
    },
  },
  computed: {
    figures() {
      return this.cardStats.data.map((stat) => stat.figure);
    },
    isFigureForConnectedUser() {
      if (this.displayFigure !== null && this.isConnectedUserCardStats) {
        return true;
      }
      return false;
    },
    evolutionColor() {
      return this.cardStats.color === "red"
        ? "bg-red200 text-red600"
        : "bg-green200 text-green600";
    },
    barColor() {
      return this.cardStats.color === "red" ? "bg-red" : "bg-green";
    },
  },
};
</script>

<style scoped>
.customHeight {
  height: 107px;
}
.down {
  transform: rotate(45deg);
}
.up {
  transform: rotate(-45deg);
}
</style>
