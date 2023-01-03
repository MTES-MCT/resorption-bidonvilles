<template>
    <div class="flex justify-between print:hidden">
        <section class="flex items-end flex-wrap space-x-4">
            <article>
                <p>Filtrer par</p>
                <div class="flex space-x-2">
                    <Filter
                        v-for="filter in currentFilters.default"
                        :key="filter.id"
                        :title="filter.label"
                        :options="filter.options"
                        v-model="townsStore.filters.properties[filter.id]"
                        @checkedItem="trackFilter(filter.label, $event)"
                    >
                        <template
                            v-if="filter.id === 'conditions'"
                            v-slot:default="{ label }"
                        >
                            <div class="text-red flex items-center">
                                <div class="mr-2">
                                    <Icon icon="times" />/
                                    <Icon icon="question" class="text-xs" />
                                </div>
                                {{ label }}
                            </div>
                        </template>
                    </Filter>
                </div>
                <div
                    class="mt-2 flex space-x-2"
                    v-if="displayOptionalFilters === true"
                >
                    <Filter
                        v-for="filter in currentFilters.optional"
                        :key="filter.id"
                        :title="filter.label"
                        :options="filter.options"
                        v-model="townsStore.filters.properties[filter.id]"
                        @checkedItem="trackFilter(filter.label, $event)"
                    />
                </div>
            </article>
            <Link v-if="displayOptionalFilters === false" @click="showOptional">
                Voir plus de filtres
            </Link>
        </section>

        <section>
            <article>
                <p>Trier par</p>
            </article>
            <Sort
                v-model="townsStore.sort"
                name="towns_list_sort"
                :options="groupedSorts[townsStore.filters.status]"
            />
        </section>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useTownsStore } from "@/stores/towns.store";
import { useUserStore } from "@/stores/user.store";
import { trackEvent } from "@/helpers/matomo";
import filters from "./ListeDesSites.filtres";
import sorts from "./ListeDesSites.tris";

import { Filter, Icon, Link, Sort } from "@resorptionbidonvilles/ui";

const townsStore = useTownsStore();
const userStore = useUserStore();
const displayOptionalFilters = ref(false);

const groupedFilters = {
    open: {
        default: [
            filters.population,
            filters.fieldType,
            filters.origin,
            filters.conditions,
        ],
        optional: [
            filters.target,
            filters.actors,
            filters.heatwave,
            ...(userStore.hasJusticePermission ? [filters.justice] : []),
        ],
    },
    close: {
        default: [filters.solvedOrClosed],
        optional: [
            filters.target,
            filters.origin,
            filters.closingReason,
            ...(userStore.hasJusticePermission ? [filters.justice] : []),
            filters.fieldType,
            filters.population,
        ],
    },
};
const groupedSorts = {
    open: [sorts.cityName, sorts.builtAt, sorts.updatedAt, sorts.declaredAt],
    close: [sorts.cityName, sorts.closedAt, sorts.updatedAt],
};

const currentFilters = computed(() => {
    return groupedFilters[townsStore.filters.status];
});

function showOptional() {
    displayOptionalFilters.value = true;
}

function trackFilter(eventAction, { label: eventName }) {
    let eventCategory;
    let eventActionPrefix;

    if (townsStore.filters.status === "close") {
        eventCategory = "Filtre des sites fermés";
        eventActionPrefix = "FDSF";
    } else {
        eventCategory = "Filtre des sites ouverts";
        eventActionPrefix = "FDSO";
    }

    trackEvent(
        eventCategory,
        `${eventActionPrefix} — ${eventAction}`,
        eventName
    );
}
</script>
