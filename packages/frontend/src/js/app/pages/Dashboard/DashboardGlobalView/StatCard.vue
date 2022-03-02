<template>
    <div
        class="border border-cardBorder bg-blue100 w-56 h-40 py-4 ml-5 statCardBorder"
    >
        <div class="flex flex-col text-center">
            <div class="text-primary text-xl mb-4">
                <Icon v-if="icon === 'male'" class="fa-lg" :icon="icon" />
                <Icon v-else :icon="icon" />
                <div class="inline-block font-bold ml-4">
                    <span>
                        {{ formatStat(cardStats.figures[0]) }}
                    </span>
                </div>
            </div>
            <span>{{ cardStats.label }} </span>
            <div v-if="cardStats.figure_secondary">
                <span class="text-primary font-bold ml-4">
                    {{ formatStat(cardStats.figure_secondary) }}
                </span>
                <br />
                {{ cardStats.label_secondary }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
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
            isEvolutionPositive: this.cardStats.evolution >= 0
        };
    },
    methods: {
        formatStat(number) {
            return new Intl.NumberFormat("fr-FR").format(number);
        }
    }
};
</script>

<style scoped>
.statCardBorder {
    border-bottom: none;
    border-radius: 10px 10px 0px 0px;
}
</style>
