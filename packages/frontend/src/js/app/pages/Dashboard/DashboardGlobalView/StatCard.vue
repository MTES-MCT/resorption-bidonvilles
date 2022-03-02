<template>
    <div
        class="border border-cardBorder bg-blue100 w-56 h-32 py-4 ml-5 statCardBorder"
    >
        <div class="px-4 flex">
            <div class="text-primary text-xl mr-4" style="opacity: 0.4">
                <Icon v-if="icon === 'male'" class="fa-lg" :icon="icon" />
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
                        <span class="text-primary font-bold">
                            {{ formatStat(cardStats.figure_secondary) }}
                        </span>
                        {{ cardStats.label_secondary }}
                    </span>
                </p>
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
