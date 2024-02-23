<template>
    <div
        class="border-1 border-cardBorder rounded-lg bg-blue100 py-1 w-56 2xl:w-64"
    >
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
                <p class="leading-tight">
                    <span class="font-bold text-primary text-xl -mb-1">
                        <template v-if="cardStats.data.length > 0">{{
                            formatStat(cardStats.data.slice(-1)[0].figure)
                        }}</template>
                        <template v-else>0</template>
                    </span>
                    {{ cardStats.label }}<br />
                    <span v-if="cardStats.figure_secondary">
                        <span
                            v-if="cardStats.id === 'population'"
                            class="text-xs"
                        >
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
        <div class="customHeight flex flex-col justify-end mt-2">
            <TableauDeBordValeurStatistique
                v-if="displayFigure !== null"
                :figure="displayFigure"
            />
            <div
                class="flex justify-center items-end mt-2"
                role="group"
                aria-label="description de l'histogramme"
                tabindex="0"
                aria-describedby="description"
            >
                <div
                    v-for="(stat, index) in columns"
                    :key="index"
                    @mouseenter="onMouseOver(stat)"
                    @mouseleave="onMouseLeave()"
                >
                    <TableauDeBordBarreHistogramme
                        :height="stat.height"
                        :color="stat.color"
                        :hoverColor="stat.hoverColor"
                        :figure="stat.figure"
                        :date="stat.date"
                        :dateFrom="stat.dateFrom"
                    />
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
                    <span class="sr-only"
                        >{{ isEvolutionPositive ? "évolution" : "diminution" }}
                    </span>
                    <span class="ml-2 align-top">
                        {{ isEvolutionPositive ? "+" : "-" }}
                        {{ Math.abs(cardStats.evolution) }} %
                        <span v-if="cardStats.data.length < 13" class="text-xs"
                            >en {{ cardStats.data.length }} semaine{{
                                cardStats.data.length > 1 ? "s" : ""
                            }}</span
                        >
                        <span v-else class="text-xs">en 3 mois</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs, ref, computed, onMounted } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";
import formatStat from "@/utils/formatStat";
import TableauDeBordValeurStatistique from "./TableauDeBordValeurStatistique.vue";
import TableauDeBordBarreHistogramme from "./TableauDeBordBarreHistogramme.vue";

const MAX_HEIGHT = 3;
const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    cardStats: {
        type: Object,
    },
});
const { icon, cardStats } = toRefs(props);

const isEvolutionPositive = computed(
    () => cardStats.value.data.length > 0 && cardStats.value.evolution >= 0
);
const columns = ref([]);
const evolutionColor = computed(() => {
    return cardStats.value.color === "red"
        ? "bg-red200 text-black"
        : "bg-green200 text-black";
});
const maxNumber = computed(() => {
    return Math.max(...cardStats.value.data.map((stat) => stat.figure));
});
const displayFigure = ref(null);

onMounted(setColumns);

function onMouseOver(value) {
    displayFigure.value = {
        figure: value.figure,
        date: value.date,
        dateFrom: value.dateFrom,
    };
}

function onMouseLeave() {
    displayFigure.value = null;
}

function setColumns() {
    if (maxNumber.value === 0 || cardStats.value.data.length === 0) {
        return;
    }

    columns.value = [
        ...cardStats.value.data.slice(0, -1).map((stat) => {
            return {
                figure: stat.figure,
                height: (stat.figure * MAX_HEIGHT) / maxNumber.value,
                date: stat.formatedDate,
                dateFrom: stat.formatedDateFrom,
                color: "bg-blue600",
                hoverColor: "bg-blue400",
            };
        }),
        {
            height:
                (cardStats.value.data.slice(-1)[0].figure * MAX_HEIGHT) /
                maxNumber.value,
            date: cardStats.value.data.slice(-1)[0].formatedDate,
            dateFrom: cardStats.value.data.slice(-1)[0].formatedDateFrom,
            figure: cardStats.value.data.slice(-1)[0].figure,
            color: cardStats.value.color === "red" ? "bg-red" : "bg-green500",
            hoverColor:
                cardStats.value.color === "red" ? "bg-red400" : "bg-green400",
        },
    ];
}
</script>

<style scoped>
.customHeight {
    height: 7rem;
}
.down {
    transform: rotate(45deg);
}
.up {
    transform: rotate(-45deg);
}
</style>
