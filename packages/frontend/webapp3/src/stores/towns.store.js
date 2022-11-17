import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";
import { useEventBus } from "@/helpers/event-bus";
import { trackEvent } from "@/helpers/matomo";
import { useUserStore } from "@/stores/user.store";
import { useConfigStore } from "./config.store";
import getDefaultLocationFilter from "@/utils/getDefaultLocationFilter";
import { fetch, fetchList, setHeatwaveStatus } from "@/api/towns.api";
import enrichShantytown from "@/utils/enrichShantytown";
import filterShantytowns from "@/utils/filterShantytowns";

const ITEMS_PER_PAGE = 20;

export const useTownsStore = defineStore("towns", () => {
    const towns = ref([]);
    const hash = ref({});
    const isLoading = ref(null);
    const error = ref(null);
    const filters = {
        status: ref("open"),
        search: ref(""),
        location: ref(null),
        properties: ref({}),
    };
    const heatwaveStatuses = ref({});
    const exportOptions = ref([]);
    const sort = ref("updatedAt");
    const filteredTowns = computed(() => {
        return filterShantytowns(towns.value, {
            status: filters.status.value,
            search: filters.search.value,
            location: filters.location.value,
            ...filters.properties.value,
        }).sort(sortFn.value);
    });
    const configStore = useConfigStore();
    const currentPage = {
        index: ref(-1), // index = 1 pour la première page
        from: computed(() => {
            if (currentPage.index.value === -1) {
                return -1;
            }

            return (currentPage.index.value - 1) * ITEMS_PER_PAGE + 1;
        }),
        to: computed(() => {
            if (currentPage.index.value === -1) {
                return -1;
            }

            return Math.min(
                filteredTowns.value.length,
                currentPage.index.value * ITEMS_PER_PAGE
            );
        }),
        content: computed(() => {
            if (currentPage.index.value === -1) {
                return [];
            }

            return filteredTowns.value.slice(
                (currentPage.index.value - 1) * ITEMS_PER_PAGE,
                currentPage.index.value * ITEMS_PER_PAGE
            );
        }),
    };
    watch(filters.search, resetPagination);
    watch(filters.location, resetPagination);
    watch(filters.status, resetPagination);
    watch(filters.properties, resetPagination, { deep: true });

    const sortFn = computed(() => {
        if (sort.value === "cityName") {
            return (a, b) => {
                if (a.city.name < b.city.name) {
                    return -1;
                }
                if (a.city.name > b.city.name) {
                    return 1;
                }
                return 0;
            };
        }

        return (a, b) => {
            return b[sort.value] - a[sort.value];
        };
    });

    function resetPagination() {
        if (filteredTowns.value.length === 0) {
            currentPage.index.value = -1;
        } else {
            currentPage.index.value = 1;
        }
    }

    function resetFilters() {
        const userStore = useUserStore();
        const { search: searchFilter, data: locationFilter } =
            getDefaultLocationFilter(userStore.user);

        filters.search.value = searchFilter;
        filters.location.value = locationFilter;
        filters.status.value = "open";

        filters.properties.value.population = [];
        filters.properties.value.fieldType = [];
        filters.properties.value.justice = [];
        filters.properties.value.origin = [];
        filters.properties.value.conditions = [];
        filters.properties.value.closingReason = [];
        filters.properties.value.solvedOrClosed = [];
        filters.properties.value.actors = [];
        filters.properties.value.target = [];
        filters.properties.value.heatwave = [];
    }

    function reset() {
        towns.value = [];
        hash.value = {};
        isLoading.value = false;
        error.value = null;
        heatwaveStatuses.value = {};
        sort.value = "updatedAt";
        resetPagination();
        resetFilters();
    }

    function updateShantytownComments(id, comments) {
        const index = hash.value[id];
        if (index !== undefined) {
            towns.value.splice(index, 1, {
                ...towns.value[index],
                comments: comments,
            });
        }
    }

    const { bus } = useEventBus();
    watch(() => bus.value.get("new-user"), reset);
    reset();

    return {
        isLoading,
        error,
        filters,
        towns,
        sort,
        currentPage,
        exportOptions,
        numberOfPages: computed(() => {
            if (filteredTowns.value.length === 0) {
                return 0;
            }

            return Math.ceil(filteredTowns.value.length / ITEMS_PER_PAGE);
        }),
        filteredTowns,
        updateShantytownComments,
        async fetchTowns() {
            if (isLoading.value === true) {
                return;
            }

            isLoading.value = true;
            error.value = null;
            try {
                const rawTowns = await fetchList();
                towns.value = rawTowns.map((town) => {
                    hash.value[town.id] = enrichShantytown(
                        town,
                        configStore.config.field_types
                    );
                    return hash.value[town.id];
                });
                currentPage.index.value = rawTowns.length > 0 ? 1 : -1;
            } catch (e) {
                error.value =
                    e?.code ||
                    e?.user_message ||
                    "Une erreur inconnue est survenue";
            }

            isLoading.value = false;
        },
        async fetchTown(townId) {
            if (!hash.value[townId]) {
                hash.value[townId] = enrichShantytown(
                    await fetch(townId),
                    configStore.config.field_types
                );
            }

            return hash.value[townId];
        },
        heatwaveStatuses,
        async setHeatwaveStatus(id, status) {
            if (heatwaveStatuses.value[id]?.loading === true) {
                return;
            }

            if (!heatwaveStatuses.value[id]) {
                heatwaveStatuses.value[id] = {
                    loading: ref(false),
                    error: ref(null),
                };
            }

            heatwaveStatuses.value[id].loading = true;
            heatwaveStatuses.value[id].error = null;
            try {
                await setHeatwaveStatus(id, status);
                hash.value[id].heatwaveStatus = status;
                trackEvent(
                    "Site",
                    `${
                        status ? "Déclenchement" : "Suppression"
                    } alerte canicule`,
                    `S${id}`
                );
            } catch (e) {
                heatwaveStatuses.value[id].error =
                    e?.user_message || "Une erreur inconnue est survenue";
            }

            heatwaveStatuses.value[id].loading = false;
        },
    };
});
