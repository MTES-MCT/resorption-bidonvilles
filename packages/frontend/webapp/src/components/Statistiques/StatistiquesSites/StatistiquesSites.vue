<template>
    <StatistiquesSection title="Suivi des sites">
        <StatistiquesSubSection
            title="Évolution mensuelle des fermetures et résorptions"
        >
            <Bar
                :chartData="shantytownsEvolutionData"
                :options="{
                    animation: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{ ticks: { beginAtZero: true } }],
                    },
                    interaction: {
                        axis: 'y',
                    },
                    responsive: true,
                }"
                :height="130"
            />
        </StatistiquesSubSection>

        <StatistiquesSubSection
            class="mt-6"
            title="Évolution mensuelle du nombre total de bidonvilles"
        >
            <Line
                :chartData="shantytownsTotalEvolutionData"
                :options="{
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{ ticks: { beginAtZero: true } }],
                    },
                }"
                :height="130"
            />
        </StatistiquesSubSection>
    </StatistiquesSection>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import StatistiquesSection from "../StatistiquesSection.vue";
import StatistiquesSubSection from "../StatistiquesSubSection.vue";
import { BarChart as Bar, LineChart as Line } from "@/helpers/chart.js";

const props = defineProps({
    stats: {
        type: Object,
        required: true,
    },
});

const { stats } = toRefs(props);
const shantytownsEvolutionData = computed(() => {
    if (
        stats.value.numberOfResorbedShantytownsPerMonth === null ||
        stats.value.numberOfNewShantytownsPerMonth === null ||
        stats.value.numberOfClosedShantytownsPerMonth === null
    ) {
        return [];
    }

    return {
        labels: stats.value.numberOfNewShantytownsPerMonth.map(
            ({ month }) => month
        ),
        datasets: [
            {
                backgroundColor: "#169B62",
                data: stats.value.numberOfResorbedShantytownsPerMonth.map((d) =>
                    parseInt(d.total, 10)
                ),
                label: "Nombre de bidonvilles résorbés",
            },
            {
                backgroundColor: "#FF8D7E",
                data: stats.value.numberOfClosedShantytownsPerMonth.map((d) =>
                    parseInt(d.total, 10)
                ),
                label: "Nombre de bidonvilles fermés",
            },
            {
                backgroundColor: "#5770BE",
                data: stats.value.numberOfNewShantytownsPerMonth.map((d) =>
                    parseInt(d.total, 10)
                ),
                label: "Nombre de nouveaux bidonvilles",
            },
        ],
    };
});

const shantytownsTotalEvolutionData = computed(() => {
    if (
        stats.value.numberOfNewShantytownsPerMonth === null ||
        stats.value.numberOfClosedShantytownsPerMonth === null
    ) {
        return [];
    }

    const initialValue = parseInt(
        stats.value.numberOfShantytownsOnJune2019,
        10
    );

    const cumulativeData = stats.value.numberOfNewShantytownsPerMonth.reduce(
        (acc, obj, index) => {
            const newShantytowns =
                stats.value.numberOfNewShantytownsPerMonth[index];
            const closedShantytowns =
                stats.value.numberOfClosedShantytownsPerMonth[index];
            const resorbedShantytowns =
                stats.value.numberOfResorbedShantytownsPerMonth[index];

            const monthDiff =
                parseInt(newShantytowns ? newShantytowns.total : 0, 10) -
                parseInt(closedShantytowns ? closedShantytowns.total : 0, 10) -
                parseInt(
                    resorbedShantytowns ? resorbedShantytowns.total : 0,
                    10
                );

            return index === 0
                ? [initialValue + monthDiff]
                : [...acc, monthDiff + acc[acc.length - 1]];
        },
        []
    );

    return {
        labels: stats.value.numberOfNewShantytownsPerMonth.map(
            ({ month }) => month
        ),
        datasets: [
            {
                fill: {
                    target: "origin",
                },
                data: cumulativeData,
                label: "Nombre total de bidonvilles",
            },
        ],
    };
});
</script>
