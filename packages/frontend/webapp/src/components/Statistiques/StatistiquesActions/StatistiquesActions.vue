<template>
    <StatistiquesSection title="Suivi des actions">
        <StatistiquesSubSection title="Financement des actions, par année">
            <div class="flex justify-center">
                <Button
                    @click="showPreviousYear"
                    :disabled="year === 2016"
                    icon="chevron-left"
                    variant="primaryText"
                />
                <table class="flex-1 credits-table">
                    <thead class="font-bold">
                        <tr>
                            <td>Origine des financements {{ year }}</td>
                            <td class="text-right w-64">Montant</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="credits[year]">
                            <td>Financements étatiques hors crédits dédiés</td>
                            <td class="text-right w-64">
                                {{ formatValue(credits[year].etatique) }}
                            </td>
                        </tr>
                        <tr v-if="credits[year]">
                            <td>
                                Crédits dédiés à la résorption des bidonvilles
                            </td>
                            <td class="text-right w-64">
                                {{ formatValue(credits[year].dedie) }}
                            </td>
                        </tr>
                        <tr v-if="credits[year]">
                            <td>Cofinancement collectivité territoriale</td>
                            <td class="text-right w-64">
                                {{ formatValue(credits[year].collectivite) }}
                            </td>
                        </tr>
                        <tr v-if="credits[year]">
                            <td>Financements privés</td>
                            <td class="text-right w-64">
                                {{ formatValue(credits[year].prive) }}
                            </td>
                        </tr>
                        <tr v-if="credits[year]">
                            <td>Financements européens</td>
                            <td class="text-right w-64">
                                {{ formatValue(credits[year].europe) }}
                            </td>
                        </tr>
                        <tr v-if="credits[year]">
                            <td>Autre</td>
                            <td class="text-right w-64">
                                {{ formatValue(credits[year].autre) }}
                            </td>
                        </tr>
                        <tr class="font-bold">
                            <td>Total</td>
                            <td class="text-right w-64">
                                {{ formatValue(total) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Button
                    @click="showNextYear"
                    :disabled="year === currentYear"
                    icon="chevron-right"
                    variant="primaryText"
                />
            </div>
        </StatistiquesSubSection>
    </StatistiquesSection>
</template>

<style scoped>
.credits-table td {
    @apply border-1 px-4 py-2;
}
</style>

<script setup>
import { defineProps, toRefs, ref, computed } from "vue";
import { Button } from "@resorptionbidonvilles/ui";
import StatistiquesSection from "../StatistiquesSection.vue";
import StatistiquesSubSection from "../StatistiquesSubSection.vue";

const props = defineProps({
    stats: {
        type: Object,
        required: true,
    },
});
const { stats } = toRefs(props);
const currentYear = ref(new Date().getFullYear());
const year = ref(currentYear.value);
const credits = computed(() => stats.value.numberOfCreditsPerYear);
const total = computed(() => {
    if (!credits[year.value]) {
        return 0;
    }

    return Object.values(credits.value[year.value]).reduce(
        (acc, obj) => acc + obj,
        0
    );
});

function showNextYear() {
    year.value += 1;
}

function showPreviousYear() {
    year.value -= 1;
}

function formatValue(val) {
    return val ? `${val.toLocaleString("fr")} €` : "-";
}
</script>
