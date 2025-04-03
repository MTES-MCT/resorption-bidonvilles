<template>
    <section
        class="flex flex-col sm:flex-row gap-4 items-start justify-between print:hidden"
    >
        <article>
            <p>Filtrer par</p>
            <div class="flex flex-col flex-wrap sm:flex-row gap-2 items-start">
                <Filter
                    v-for="filter in currentFilters.default"
                    :key="filter.id"
                    :title="filter.label"
                    :options="filter.options"
                    v-model="townsStore.filters.properties[filter.id]"
                    @checkedItem="trackFilter(filter.label, $event)"
                    class="border-1 !border-primary rounded hover:bg-blue200 text-sm"
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

                <Link
                    class="sm:self-end"
                    v-if="displayOptionalFilters === false"
                    @click="showOptional"
                >
                    Voir plus de filtres
                </Link>
                <template v-else>
                    <Filter
                        v-for="filter in currentFilters.optional"
                        :key="filter.id"
                        :title="filter.label"
                        :options="filter.options"
                        v-model="townsStore.filters.properties[filter.id]"
                        @checkedItem="trackFilter(filter.label, $event)"
                        class="border-1 !border-primary rounded hover:bg-blue200"
                    />
                </template>
            </div>
        </article>

        <article class="shrink-0">
            <p>Trier par</p>
            <Sort
                v-model="townsStore.sort"
                name="towns_list_sort"
                :options="groupedSorts[townsStore.filters.status]"
                class="border-1 !border-primary rounded hover:bg-blue200"
            />
        </article>
    </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
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
            ...(userStore.hasJusticePermission
                ? [filters.administrativeOrder]
                : []),
            ...(userStore.hasJusticePermission ? [filters.rhi] : []),
        ],
    },
    inProgress: {
        default: [filters.population, filters.fieldType, filters.origin],
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
            ...(userStore.hasJusticePermission
                ? [filters.administrativeOrder]
                : []),
            ...(userStore.hasJusticePermission ? [filters.rhi] : []),
            filters.fieldType,
            filters.population,
        ],
    },
};
const groupedSorts = {
    open: [sorts.cityName, sorts.builtAt, sorts.updatedAt, sorts.declaredAt],
    inProgress: [
        sorts.cityName,
        sorts.builtAt,
        sorts.updatedAt,
        sorts.declaredAt,
    ],
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

    switch (townsStore.filters.status) {
        case "close":
            eventCategory = "Filtre des sites fermés";
            eventActionPrefix = "FDSF";
            break;
        case "open":
            eventCategory = "Filtre des sites ouverts";
            eventActionPrefix = "FDSO";
            break;
        case "inProgress":
            eventCategory = "Filtre des sites en cours de résorption";
            eventActionPrefix = "FDSECDR";
            break;
    }

    trackEvent(
        eventCategory,
        `${eventActionPrefix} — ${eventAction}`,
        eventName
    );
}

const isProcessing = ref(false);
const isUeOnly = ref(false);

watch(isUeOnly, (newValue) => {
    if (newValue) {
        const currentFilters = { ...townsStore.filters.properties };
        townsStore.filters.properties = {
            ...currentFilters,
            origin: ["0"],
        };
    }
});

watch(
    () => townsStore.filters.properties.origin,
    (newValue, oldValue) => {
        if (!isProcessing.value) {
            isProcessing.value = true;
            const hasOtherValues = newValue.some((value) => value !== "0");
            if (
                hasOtherValues &&
                newValue.includes("0") &&
                oldValue.includes("0")
            ) {
                const currentFilters = { ...townsStore.filters.properties };
                const filteredOrigin = currentFilters.origin.filter(
                    (value) => value !== "0"
                );
                townsStore.filters.properties = {
                    ...currentFilters,
                    origin: filteredOrigin,
                };
            } else {
                isUeOnly.value = newValue[0] === "0";
            }
            isProcessing.value = false;
        }
    },
    { immediate: true }
);
</script>
