<template>
    <LayoutSearch
        allowFreeSearch
        searchTitle=" Rechercher une action, une commune, un département..."
        searchPlaceholder="Nom d'une action, commune, département..."
        showNationalWording="Voir toutes les actions de France"
        v-model:location="location"
    >
        <ListeDesActions />
    </LayoutSearch>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { usePlansStore } from "@/stores/plans.store";

import LayoutSearch from "@/components/LayoutSearch/LayoutSearch.vue";
import ListeDesActions from "@/components/ListeDesActions/ListeDesActions.vue";

const plansStore = usePlansStore();
const location = computed({
    get() {
        return {
            search: plansStore.filters.search,
            data: plansStore.filters.location,
        };
    },
    set(newValue) {
        if (!newValue) {
            plansStore.filters.search = "";
            plansStore.filters.location = null;
        } else {
            plansStore.filters.search = newValue?.search;
            plansStore.filters.location = newValue?.data;
        }
    },
});

onMounted(() => {
    if (plansStore.plans.length === 0) {
        load();
    }
});

function load() {
    plansStore.fetchPlans();
}
</script>
