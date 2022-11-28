<template>
    <FicheRubrique title="Public" id="public">
        <TableauRb class="my-4" :columns="columns" :data="data"></TableauRb>
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import entries from "./FicheActionPublic.entries";
import columns from "./FicheActionPublic.columns";

import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import TableauRb from "@/components/Tableau/TableauRb.vue";

const props = defineProps({
    audience: Object,
});
const { audience } = toRefs(props);

const data = computed(() => {
    if (!audience.value) {
        return [];
    }

    return entries.map(({ id, label }) => {
        return {
            label,
            families: audience.value[id].families,
            total: audience.value[id].total,
            women: audience.value[id].women,
            minors: audience.value[id].minors,
        };
    });
});
</script>
