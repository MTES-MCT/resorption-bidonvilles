<template>
    <div
        class="border border-cardBorder bg-blue100 w-56 pb-6 ml-5 barCardBorder"
    >
        <span class="block h-px bg-blue300"></span>
        <!--<h1 class="pl-8 my-2 font-bold text-sm">Évolution</h1>-->
        <div class="flex justify-center items-end mt-5">
            <Bar
                :height="figure"
                v-for="(figure, index) in columns"
                :key="index"
            ></Bar>
        </div>
        <div class="text-center ml-auto mr-auto mt-4 bg-red200 text-red600">
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
        }
    },
    data() {
        return {
            isEvolutionPositive: this.cardStats.evolution >= 0,
            columns: []
        };
    },
    mounted() {
        this.setColumns();
    },
    methods: {
        setColumns() {
            this.columns = this.cardStats.figures.slice();
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

<style scoped>
.barCardBorder {
    border-top: none;
    border-radius: 0px 0px 10px 10px;
}

.down {
    transform: rotate(45deg);
}
.up {
    transform: rotate(-45deg);
}
</style>
