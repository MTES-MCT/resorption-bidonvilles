<template>
    <div
        class="border flex flex-col p-4 rounded-md border-cardBorder bg-blue100 w-56 mr-5"
    >
        <div class="flex pb-4">
            <div class="pr-4 text-primary text-xl">
                <Icon :icon="icon" />
            </div>
            <div class="flex-1">
                <div class="flex justify-between items-center font-bold">
                    <span class="text-primary text-xl">
                        {{ cardStats.figures[0] }}
                    </span>
                    <span class="text-green" v-if="isEvolutionPositive">
                        +{{
                            cardStats.evolution !== null
                                ? cardStats.evolution
                                : 0
                        }}
                        %
                    </span>
                    <span class="text-red" v-else>
                        {{ cardStats.evolution }} %
                    </span>
                </div>
                <span>{{ cardStats.label }} </span>
            </div>
        </div>
        <div class="mt-auto">
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
        icon: {
            type: String,
            required: true
        },
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
