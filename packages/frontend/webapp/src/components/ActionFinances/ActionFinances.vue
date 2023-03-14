<template>
    <div class="flex justify-between items-center">
        <Button
            icon="arrow-left"
            iconPosition="left"
            type="button"
            variant="textPrimary"
            :disabled="focusedYear <= minYear"
            @click="previousYear"
            >Année précédente</Button
        >
        <p class="text-lg text-primary font-bold text-center">
            Année {{ focusedYear }}
        </p>
        <Button
            icon="arrow-right"
            iconPosition="right"
            type="button"
            variant="textPrimary"
            :disabled="focusedYear >= maxYear"
            @click="nextYear"
            >Année suivante</Button
        >
    </div>

    <Tableau :columns="COLUMNS_DEFINITION" :data="focusedYearData">
        <template v-slot:empty
            >Aucun financement renseigné pour cette année</template
        >
        <template v-slot:cell="{ column, content }">
            <span v-if="column === 'finance_type'">{{ content }}</span>
            <span v-if="column === 'comments'">{{ content || "-" }}</span>
            <span v-else-if="column === 'amount'">{{ content }}</span>
            <span v-else-if="column === 'real_amount'">{{ content }}</span>
        </template>
    </Tableau>

    <p class="mt-1">
        <template v-if="yearsWithData.length > 0">
            Années avec financements renseignés :
            <Link
                class="mr-1"
                v-for="year in yearsWithData"
                :key="year"
                withStyle
                @click="($event) => setYear(parseInt(year, 10))"
                >{{ year }}</Link
            >
        </template>
        <template v-else
            >Il n'existe pas encore d'année avec une ligne de financement
            renseignée.</template
        >
    </p>
</template>

<script setup>
import { defineProps, toRefs, computed, ref } from "vue";
import formatMoney from "@/utils/formatMoney";

import Tableau from "@/components/Tableau/TableauRb.vue";
import { Button, Link } from "@resorptionbidonvilles/ui";

const props = defineProps({
    minYear: {
        type: Number,
        required: true,
    },
    maxYear: {
        type: Number,
        default() {
            return new Date().getFullYear();
        },
    },
    finances: Object,
});
const { finances, minYear, maxYear } = toRefs(props);

const COLUMNS_DEFINITION = [
    { id: "finance_type", label: "Type de financement" },
    { id: "comments", label: "Description" },
    { id: "amount", label: "Montant du financement" },
    { id: "real_amount", label: "Dépense exécutée" },
];

const focusedYear = ref(Math.min(maxYear.value, new Date().getFullYear()));
const focusedYearData = computed(() => {
    return (finances.value[focusedYear.value] || []).map((row) => ({
        amount: formatMoney(row.amount),
        real_amount: formatMoney(row.real_amount),
        comments: row.comments,
        finance_type: row.type.name,
    }));
});
const yearsWithData = computed(() => {
    return Object.keys(finances.value).filter(
        (year) => finances.value[year]?.length > 0
    );
});

function setYear(year) {
    focusedYear.value = year;
}

function previousYear() {
    setYear(Math.max(minYear.value || 0, focusedYear.value - 1));
}

function nextYear() {
    setYear(Math.min(maxYear.value, focusedYear.value + 1));
}
</script>
