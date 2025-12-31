<template>
    <section
        class="flex flex-col sm:flex-row gap-4 items-start justify-between"
    >
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
                        class="!border !border-primary rounded hover:bg-blue200"
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

        <article class="shrink-0">
            <p>Trier par</p>
            <Sort
                v-model="actionsStore.sort"
                name="actions_list_sort"
                :options="sortOptions"
                class="border-1 !border-primary rounded hover:bg-blue200"
            />
        </article>
    </section>
</template>

<script setup>
import { computed } from "vue";
import { useActionsStore } from "@/stores/actions.store";
import filters from "./ListeDesActions.filtres";
import sorts from "./ListeDesActions.tris";

import { Filter, Sort } from "@resorptionbidonvilles/ui";

const actionsStore = useActionsStore();

const sortOptions = [sorts.startedAt, sorts.updatedAt, sorts.lastMetricUpdate];

const isFiltered = computed(() => {
    const filterValues = Object.values(actionsStore.filters.properties);
    const activeFiltersCount = filterValues.filter(
        (value) => Array.isArray(value) && value.length > 0
    ).length;
    return activeFiltersCount >= 2;
});
</script>
