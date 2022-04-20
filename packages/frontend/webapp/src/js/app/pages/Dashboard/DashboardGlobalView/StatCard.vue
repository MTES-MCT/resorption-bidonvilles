<template>
    <div
        class="border-1 border-cardBorder rounded-lg bg-blue100 py-1 w-64 mr-10"
    >
        <div class="flex px-4 customHeight">
            <div class="text-primary text-xl mr-4" style="opacity: 0.4">
                <Icon
                    v-if="cardStats.id === 'population'"
                    class="fa-lg"
                    :icon="icon"
                />
                <Icon v-else :icon="icon" />
            </div>
            <div>
                <div class="font-bold text-primary text-xl -mb-1">
                    <span>
                        {{ formatStat(cardStats.figures.slice(-1)[0]) }}
                    </span>
                </div>
                <p class="leading-tight">
                    {{ cardStats.label }}
                    <span v-if="cardStats.figure_secondary">
                        {{ cardStats.label_secondary }} <br />
                        <span class="text-primary font-bold">
                            {{ formatStat(cardStats.figure_secondary) }}
                        </span>
                        {{ cardStats.label_tertiary }}
                    </span>
                </p>
                <p v-if="cardStats.id === 'closed'">hors résorption</p>
                <p
                    v-if="['resorbed', 'closed'].includes(cardStats.id)"
                    class="text-xs"
                >
                    depuis
                    {{
                        cardStats.id === "closed" ? "janvier 2019" : "sept 2020"
                    }}
                </p>
            </div>
        </div>
        <span class="block h-px bg-blue300"></span>
        <div class="border-1 customHeight flex flex-col justify-end">
            <div class="flex justify-center items-end mt-3">
                <Bar
                    :height="figure"
                    v-for="(figure, index) in columns"
                    :key="index"
                    class="bg-blue600"
                ></Bar>
                <Bar :height="latestFigureHeight" :class="barColor"></Bar>
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
