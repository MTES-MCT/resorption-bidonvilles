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
                    v-model="actionsStore.filters.properties[filter.id]"
                    class="border-1 !border-primary rounded hover:bg-blue200"
                />
            </div>
        </article>
    </section>
</template>

<script setup>
import { useActionsStore } from "@/stores/actions.store";
import filters from "./ListeDesActions.filtres";

import { Filter } from "@resorptionbidonvilles/ui";

const actionsStore = useActionsStore();
</script>
