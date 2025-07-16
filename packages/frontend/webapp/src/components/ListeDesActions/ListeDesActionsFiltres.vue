<template>
    <section class="flex items-end flex-wrap space-x-4">
        <article class="flex flex-col gap-2">
            <div>
                <p>Filtrer par</p>
                <div class="flex flex-col xs:flex-row gap-2 flex-wrap shrink-0">
                    <Filter
                        v-for="filter in filters"
                        :key="filter.id"
                        :title="filter.label"
                        :options="filter.options"
                        v-model="actionsStore.filters.properties[filter.id]"
                        class="!border-primary rounded hover:bg-blue200"
                    />
                </div>
            </div>
            <div>
                <DsfrButton
                    v-if="isFiltered"
                    label="Effacer les filtres"
                    size="sm"
                    @click="actionsStore.resetFilters"
                />
            </div>
        </article>
    </section>
</template>

<script setup>
import { computed } from "vue";
import { useActionsStore } from "@/stores/actions.store";
import filters from "./ListeDesActions.filtres";

import { Filter } from "@resorptionbidonvilles/ui";

const actionsStore = useActionsStore();

const isFiltered = computed(() => {
    const filterValues = Object.values(actionsStore.filters.properties);
    const activeFiltersCount = filterValues.filter(
        (value) => Array.isArray(value) && value.length > 0
    ).length;
    return activeFiltersCount >= 2;
});
</script>
