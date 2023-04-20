<template>
    <StatistiquesSection title="Suivi des habitants">
        <StatistiquesSubSection
            title="Évolution mensuelle du nombre d'habitants en bidonvilles"
        >
            <Line
                :chartData="populationTotalEvolutionData"
                :options="{
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{ ticks: { beginAtZero: true } }],
                    },
                }"
                :height="130"
            />
            <p class="mt-4 text-sm text-center">
                La donnée sur le nombre de ressortissants UE est disponible
                uniquement à partir de mars 2021.
            </p>
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
const populationTotalEvolutionData = computed(() => {
    if (stats.value.populationTotal === null) {
        return [];
    }

    const {
        total,
        totalEU,
        totalLivingInTownsBiggerThan10,
        totalEULivingInTownsBiggerThan10,
    } = stats.value.populationTotal.reduce(
        (
            acc,
            {
                total,
                totalEU,
                totalLivingInTownsBiggerThan10,
                totalEULivingInTownsBiggerThan10,
            }
        ) => {
            acc.total.push(total);
            acc.totalEU.push(totalEU);
            acc.totalLivingInTownsBiggerThan10.push(
                totalLivingInTownsBiggerThan10
            );
            acc.totalEULivingInTownsBiggerThan10.push(
                totalEULivingInTownsBiggerThan10
            );
            return acc;
        },
        {
            total: [],
            totalEU: [],
            totalLivingInTownsBiggerThan10: [],
            totalEULivingInTownsBiggerThan10: [],
        }
    );
    return {
        labels: stats.value.populationTotal.map(({ month }) => month),
        datasets: [
            {
                backgroundColor: "#E5E5F4",
                data: total,
                label: "Nombre d'habitants",
            },
            {
                backgroundColor: "#5770BE",
                data: totalEU,
                label: "Nombre de ressortissants UE",
            },
            {
                backgroundColor: "#FF8D7E",
                data: totalLivingInTownsBiggerThan10,
                label: "Nombre total d'habitants vivant dans des sites de 10 personnes ou plus",
            },
            {
                backgroundColor: "#169B62",
                data: totalEULivingInTownsBiggerThan10,
                label: "Nombre de ressortissants UE vivant dans des sites de 10 personnes ou plus",
            },
        ],
    };
});
</script>
