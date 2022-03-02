<template>
    <div
        class="border border-cardBorder bg-blue100 w-56 pt-5 h-40 ml-5 barCardBorder"
    >
        <div class="flex justify-center items-end mt-5">
            <Bar
                :height="figure"
                v-for="(figure, index) in columns"
                :key="index"
            ></Bar>
        </div>
        <div class=" w-1/2 text-center ml-auto mr-auto my-4">
            <Icon
                class="up"
                v-if="isEvolutionPositive"
                icon="arrow-alt-circle-right"
            />
            <Icon class="down" v-else icon="arrow-alt-circle-right" />
            <span class="ml-2" ref="evolution">
                {{ isEvolutionPositive ? "+" : "-" }}
                {{ Math.abs(cardStats.evolution) }} %
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
        this.$refs.evolution.style.color = this.cardStats.color;
        this.$refs.evolution.parentNode.style.backgroundColor =
            this.$refs.evolution.style.color === "red" ? "#F7BFC3" : "#9ae6b4";
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
