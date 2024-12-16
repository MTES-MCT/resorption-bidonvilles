<template>
    <section class="flex items-end flex-wrap space-x-4">
        <article>
            <p>Filtrer par</p>
            <div class="flex space-x-2">
                <Filter
                    v-for="filter in filterOptions"
                    :key="filter.id"
                    :title="filter.label"
                    class="border-1 !border-primary rounded hover:bg-blue200"
                    :options="filter.options"
                    v-model="activitiesStore.filters.properties[filter.id]"
                />
            </div>
        </article>
    </section>
</template>

<script setup>
import { useActivitiesStore } from "@/stores/activities.store";
import filterOptions from "./HistoriqueActivites.filtres";

import { Filter } from "@resorptionbidonvilles/ui";

const activitiesStore = useActivitiesStore();
</script>
