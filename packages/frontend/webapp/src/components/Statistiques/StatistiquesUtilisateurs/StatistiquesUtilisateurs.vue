<template>
    <StatistiquesSection title="Suivi de la plateforme">
        <StatistiquesSubSection
            title="Évolution hebdomadaire du nombre d'utilisateurs uniques"
        >
            <Line
                :chartData="wauData"
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
import { toRefs, computed } from "vue";
import StatistiquesSection from "../StatistiquesSection.vue";
import StatistiquesSubSection from "../StatistiquesSubSection.vue";
import { Line } from "@/helpers/chart.js";

const props = defineProps({
    stats: {
        type: Object,
        required: true,
    },
});

const { stats } = toRefs(props);
const wauData = computed(() => {
    return {
        labels: stats.value.wau.map(({ monday }) => `Semaine du ${monday}`),
        datasets: [
            {
                backgroundColor: "#E5E5F4",
                data: stats.value.wau.map(({ wau }) => wau),
                label: "Nombre d'utilisateurs sur la semaine",
            },
        ],
    };
});
</script>
