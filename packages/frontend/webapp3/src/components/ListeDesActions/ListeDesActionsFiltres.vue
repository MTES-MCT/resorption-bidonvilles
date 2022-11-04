<template>
    <section class="flex items-end flex-wrap space-x-4">
        <article>
            <p>Filtrer par</p>
            <div class="flex space-x-2">
                <Filter
                    v-for="filter in filters"
                    :key="filter.id"
                    :title="filter.label"
                    :options="filter.options"
                    v-model="plansStore.filters.properties[filter.id]"
                />
            </div>
        </article>
    </section>
</template>

<script setup>
import { usePlansStore } from "@/stores/plans.store";
import filters from "./ListeDesActions.filtres";

import { Filter } from "@resorptionbidonvilles/ui";

const plansStore = usePlansStore();
</script>
