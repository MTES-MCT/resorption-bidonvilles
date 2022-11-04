<template>
    <h1 class="text-3xl text-info font-bold">{{ title }}</h1>
    <div class="flex justify-between mt-4">
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
        <section>
            <Pagination
                v-if="plansStore.filteredPlans.length > 0"
                class="mx-auto"
                :currentPage="plansStore.currentPage.index"
                :nbPages="plansStore.numberOfPages"
                @pagechange="changePage"
            />
        </section>
    </div>
</template>

<script setup>
import { ref, toRefs, computed } from "vue";
import { usePlansStore } from "@/stores/plans.store";
import { useConfigStore } from "@/stores/config.store";
import { Pagination } from "@resorptionbidonvilles/ui";
import computeLocationSearchTitle from "@/utils/computeLocationSearchTitle";

import { Filter } from "@resorptionbidonvilles/ui";

const plansStore = usePlansStore();
const configStore = useConfigStore();

const { location, search } = toRefs(plansStore.filters);

function changePage(page) {
    plansStore.currentPage.index = page;
}
const filters = ref([
    {
        label: "Champs d'intervention",
        id: "topic",
        display: true,
        options: configStore.config.topics.map(({ uid, name }) => ({
            value: uid,
            label: name,
        })),
    },
    {
        label: "Lieu d'intervention",
        id: "interventionLocation",
        display: true,
        options: [
            { value: "shantytowns", label: "Sur Site" },
            { value: "location", label: "Sur terrain d'insertion" },
            {
                value: "housing",
                label: "Dans le logement",
            },
            {
                value: "other",
                label: "Dans plusieurs lieux(hébergement, permanence, rue)",
            },
        ],
    },
]);

const title = computed(() => {
    return computeLocationSearchTitle(search.value, location.value);
});
</script>
