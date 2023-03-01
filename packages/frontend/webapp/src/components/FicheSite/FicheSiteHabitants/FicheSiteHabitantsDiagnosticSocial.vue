<template>
    <FicheSousRubrique>
        <p>
            <span class="font-bold">Diagnostic social</span><br />
            {{ diagnostic }}
        </p>
        <p class="italic mt-6">
            <Icon icon="info-circle" /> Un diagnostic social vise à identifier
            les situations et besoins des familles et personnes, de repérer le
            contexte territorial et les acteurs en présence.
        </p>
    </FicheSousRubrique>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import formatDate from "@/utils/formatDate";

import { Icon } from "@resorptionbidonvilles/ui";
import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const diagnostic = computed(() => {
    if (town.value.censusStatus === "done") {
        return `réalisé le ${formatDate(
            town.value.censusConductedAt,
            "d/m/y"
        )} par ${town.value.censusConductedBy}`;
    }

    if (town.value.censusStatus === "scheduled") {
        return `prévu le ${formatDate(
            town.value.censusConductedAt,
            "d/m/y"
        )} par ${town.value.censusConductedBy}`;
    }

    if (town.value.censusStatus === "none") {
        return "non réalisé";
    }

    return "non communiqué";
});
</script>
