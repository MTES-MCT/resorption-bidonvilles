<template>
    <div
        class="border flex flex-col justify-between rounded-md border-cardBorder bg-blue100 w-56 h-40 mr-5"
    >
        <div>
            <span class="text-primary text-display-md pl-10">
                {{ cardStats.figures[0] }}
            </span>
            <span class="text-green float-right" v-if="isEvolutionPositive">
                +{{ cardStats.evolution !== null ? cardStats.evolution : 0 }} %
            </span>
            <span class="text-red float-right" v-else>
                {{ cardStats.evolution }} %
            </span>
        </div>
        <span class="pl-10">{{ cardStats.label }} </span>
        <div class="mb-2">
            <div class="flex justify-center items-end">
                <div v-for="(figure, index) in columns" :key="figure">
                    <Bar
                        v-if="
                            isEvolutionPositive && index === columns.length - 1
                        "
                        :height="figure"
                        class="bg-green"
                    >
                    </Bar>
                    <Bar
                        v-else-if="
                            !isEvolutionPositive && index === columns.length - 1
                        "
                        :height="figure"
                        class="bg-red"
                    >
                    </Bar>
                    <Bar v-else :height="figure" class="bg-blue600"></Bar>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Bar from "./Bar.vue";
export default {
    components: {
        Bar
    },
    props: {
        cardStats: {
            type: Object
        },
        period: {
            type: String
        }
    },
    data() {
        return {
            isEvolutionPositive: this.cardStats.evolution >= 0,
            columns: []
        };
    },
    mounted() {
        this.columnsByTemporality();
    },
    watch: {
        period() {
            this.columnsByTemporality();
        }
    },

    methods: {
        columnsByTemporality() {
            if (this.period === "month") {
                this.columns = this.cardStats.figures.slice(0, 4);
            } else if (this.period === "trimestre") {
                this.columns = this.cardStats.figures.slice();
            }
            this.columns.reverse();
            const maxNumber = Math.max(...this.columns);
            if (maxNumber !== 0) {
                this.columns = this.columns.map(
                    number => (number * 50) / maxNumber
                );
            }
        }
    }
};
</script>
