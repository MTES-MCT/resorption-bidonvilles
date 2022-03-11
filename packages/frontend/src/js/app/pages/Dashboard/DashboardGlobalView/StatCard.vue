<template>
    <div class="border border-cardBorder rounded-lg bg-blue100 py-1 w-64 mr-10">
        <div class="flex px-4 customHeight mb-2">
            <div class="text-primary text-xl mr-4" style="opacity: 0.4">
                <Icon
                    v-if="cardStats.id === 'population'"
                    class="fa-lg"
                    :icon="icon"
                />
                <Icon v-else :icon="icon" />
            </div>
            <div>
                <div class="inline-block font-bold text-primary text-xl">
                    <span>
                        {{ formatStat(cardStats.figures[0]) }}
                    </span>
                </div>
                <p>
                    {{ cardStats.label }}
                    <span v-if="cardStats.figure_secondary">
                        {{ cardStats.label_secondary }} <br />
                        <span class="text-primary font-bold">
                            {{ formatStat(cardStats.figure_secondary) }}
                        </span>
                        {{ cardStats.label_tertiary }}
                    </span>
                </p>
                <span v-if="cardStats.id === 'closed'"> hors résorption</span>
                <span
                    v-if="['resorbed', 'closed'].includes(cardStats.id)"
                    class="text-xs"
                >
                    depuis janvier 2019</span
                >
            </div>
        </div>
        <div class="customHeight">
            <span class="block h-px bg-blue300"></span>
            <div class="flex justify-center items-end mt-3">
                <Bar
                    :height="figure"
                    v-for="(figure, index) in columns"
                    :key="index"
                    class="bg-blue600"
                ></Bar>
                <Bar :height="latestFigureHeight" :class="barColor"></Bar>
            </div>
            <div class="text-center ml-auto mr-auto mt-4">
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
        Bar
    },
    props: {
        icon: {
            type: String,
            required: true
        },
        cardStats: {
            type: Object
        }
    },
    data() {
        return {
            isEvolutionPositive: this.cardStats.evolution >= 0,
            columns: [],
            maxNumber: Math.max(...this.cardStats.figures)
        };
    },
    mounted() {
        this.setColumns();
    },
    methods: {
        formatStat(number) {
            return new Intl.NumberFormat("fr-FR").format(number);
        },
        setColumns() {
            this.columns = this.cardStats.figures.slice(0, -1);
            if (this.maxNumber !== 0) {
                this.columns = this.columns.map(
                    number => (number * MAX_HEIGHT) / this.maxNumber
                );
            }
        }
    },
    computed: {
        latestFigureHeight() {
            return (
                (this.cardStats.figures.slice(-1)[0] * MAX_HEIGHT) /
                this.maxNumber
            );
        },
        evolutionColor() {
            return this.cardStats.color === "red"
                ? "bg-red200 text-red600"
                : "bg-green200 text-green600";
        },
        barColor() {
            return this.cardStats.color === "red" ? "bg-red" : "bg-green";
        }
    }
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
