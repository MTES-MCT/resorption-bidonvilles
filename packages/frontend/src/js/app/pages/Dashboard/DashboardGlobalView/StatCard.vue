<template>
    <div
        class="border border-cardBorder bg-blue100 w-56 h-32 py-4 ml-5 statCardBorder"
    >
        <div class="flex flex-col text-center">
            <div class="text-primary text-xl mb-4">
                <Icon :icon="icon" />
                <div class="inline-block font-bold ml-4">
                    <span>
                        {{ formatedStat }}
                    </span>
                </div>
            </div>
            <span>{{ cardStats.label }} </span>
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
    computed: {
        formatedStat() {
            return new Intl.NumberFormat("fr-FR").format(
                this.cardStats.figures[0]
            );
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
