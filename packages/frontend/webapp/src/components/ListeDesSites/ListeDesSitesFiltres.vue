<template>
    <section
        class="flex flex-col sm:flex-row gap-4 items-start justify-between print:hidden"
    >
        <article>
            <p>Filtrer par</p>
            <div class="flex flex-col flex-wrap gap-2 items-start">
                <div
                    class="flex flex-col flex-wrap sm:flex-row gap-2 items-start"
                >
                    <Filter
                        v-if="isFavoritesTab"
                        title="Mes sites"
                        :options="myTownsFilterOptions"
                        v-model="favoritesStore.myTownsFilter"
                        class="border-1 !border-primary rounded hover:bg-blue200 text-sm"
                    />
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
                        <template
                            v-for="filter in currentFilters.optional"
                            :key="filter.id"
                        >
                            <FilterClosureYear
                                v-if="filter.id === 'closureYear'"
                                :title="filter.label"
                                :options="filter.options"
                                v-model="
                                    townsStore.filters.properties[filter.id]
                                "
                                @checkedItem="trackFilter(filter.label, $event)"
                                class="border-1 !border-primary rounded hover:bg-blue200"
                            />
                            <Filter
                                v-else
                                :title="filter.label"
                                :options="filter.options"
                                v-model="
                                    townsStore.filters.properties[filter.id]
                                "
                                @checkedItem="trackFilter(filter.label, $event)"
                                class="border-1 !border-primary rounded hover:bg-blue200"
                            />
                        </template>
                    </template>
                </div>
                <div>
                    <DsfrButton
                        v-if="isFiltered"
                        class="justify-self-end"
                        size="sm"
                        label="Effacer les filtres"
                        :disabled="isProcessing"
                        @click="resetFilters"
                    />
                </div>
            </div>
        </article>

        <article v-if="!isFavoritesTab" class="shrink-0">
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
import { computed, ref, watch, toRefs } from "vue";
import { useTownsStore } from "@/stores/towns.store";
import { useUserStore } from "@/stores/user.store";
import { trackEvent } from "@/helpers/matomo";
import filters from "./ListeDesSites.filtres";
import sorts from "./ListeDesSites.tris";
import useClosureYears from "@/composables/useClosureYears";
import FilterClosureYear from "./FilterClosureYear.vue";

import { useFavoritesStore } from "@/stores/favorites.store";

import { Filter, Icon, Link, Sort } from "@resorptionbidonvilles/ui";

const props = defineProps({
    // Active le contexte de l'onglet « Mes sites » : ajoute le filtre « Mes sites »
    // en tête, restreint aux filtres pertinents et masque le tri.
    isFavoritesTab: {
        type: Boolean,
        default: false,
    },
});
const { isFavoritesTab } = toRefs(props);

const townsStore = useTownsStore();
const userStore = useUserStore();
const favoritesStore = useFavoritesStore();
const displayOptionalFilters = ref(false);
const { closureYears } = useClosureYears();

// Options du filtre « Mes sites » (cases à cocher). Aucune case = union.
const myTownsFilterOptions = [
    { value: "intervention", label: "Les sites sur lesquels j'interviens" },
    { value: "favorites", label: "Mes sites épinglés" },
];

const isFiltered = computed(() => {
    const filteredValues = Object.values(townsStore.filters.properties);
    const activeFiltersCount = filteredValues.filter(
        (value) => Array.isArray(value) && value.length > 0
    ).length;

    // Sur l'onglet « Mes sites », le filtre « Mes sites » compte comme un filtre
    // actif, pour proposer « Effacer les filtres » dès qu'il est renseigné.
    if (isFavoritesTab.value && favoritesStore.myTownsFilter.length > 0) {
        return activeFiltersCount >= 1;
    }

    return activeFiltersCount >= 2;
});

const groupedFilters = computed(() => ({
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
        default: [
            filters.resorbedOrClosed,
            filters.closingReason,
            filters.target,
        ],
        optional: [
            { ...filters.closureYear, options: closureYears.value },
            filters.origin,
            ...(userStore.hasJusticePermission ? [filters.justice] : []),
            ...(userStore.hasJusticePermission
                ? [filters.administrativeOrder]
                : []),
            ...(userStore.hasJusticePermission ? [filters.rhi] : []),
            filters.fieldType,
            filters.population,
        ],
    },
    favorites: {
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
}));
const groupedSorts = {
    open: [
        sorts.cityName,
        sorts.siteName,
        sorts.builtAt,
        sorts.updatedAt,
        sorts.declaredAt,
    ],
    inProgress: [
        sorts.cityName,
        sorts.siteName,
        sorts.builtAt,
        sorts.updatedAt,
        sorts.declaredAt,
    ],
    close: [sorts.cityName, sorts.siteName, sorts.closedAt, sorts.updatedAt],
};

const currentFilters = computed(() => {
    const key = isFavoritesTab.value ? "favorites" : townsStore.filters.status;
    return groupedFilters.value[key];
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

const resetFilters = async () => {
    try {
        townsStore.resetFilters();
        if (isFavoritesTab.value) {
            favoritesStore.myTownsFilter = [];
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Erreur lors de la suppression des filtres:", error);
    }
};

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
