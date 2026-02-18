import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { list } from "@/api/signinLogs.api";
import Fuse from "fuse.js";

const ITEMS_PER_PAGE = 8;

export const useSigninLogsStore = defineStore("signinLogs", () => {
    const sortedLogs = ref([]);
    const hash = ref({});
    const hasLoaded = ref(false);

    const fuse = computed(() => {
        return new Fuse(sortedLogs.value, {
            threshold: 0.1,
            shouldSort: false,
            keys: [
                { name: "email", weight: 0.4 },
                { name: "user.firstName", weight: 0.3 },
                { name: "user.lastName", weight: 0.3 },
                { name: "ipAddress", weight: 0.2 },
            ],
        });
    });

    const filters = {
        search: ref(""),
        success: ref([]),
        ipAddress: ref(""),
        dateFrom: ref(null),
        dateTo: ref(null),
    };

    const filteredLogs = computed(() => {
        let filtered = sortedLogs.value;

        if (filters.search.value) {
            // Recherche exacte sur l'email d'abord
            const exactEmailMatches = filtered.filter((log) =>
                log.email
                    .toLowerCase()
                    .includes(filters.search.value.toLowerCase())
            );

            // Recherche floue sur les autres champs si aucune correspondance exacte
            if (exactEmailMatches.length === 0) {
                filtered = fuse.value
                    .search(filters.search.value)
                    .map(({ item }) => item);
            } else {
                filtered = exactEmailMatches;
            }
        }

        if (filters.ipAddress.value) {
            filtered = filtered.filter((log) =>
                log.ipAddress.includes(filters.ipAddress.value)
            );
        }

        const successFilters = filters.success.value;
        if (successFilters.length > 0) {
            filtered = filtered.filter((log) => {
                if (successFilters.includes("success") && log.success) {
                    return true;
                }
                if (successFilters.includes("failure") && !log.success) {
                    return true;
                }
                return false;
            });
        }

        if (filters.dateFrom.value) {
            const dateFrom = new Date(filters.dateFrom.value);
            filtered = filtered.filter(
                (log) => new Date(log.attemptedAt) >= dateFrom
            );
        }

        if (filters.dateTo.value) {
            const dateTo = new Date(filters.dateTo.value);
            filtered = filtered.filter(
                (log) => new Date(log.attemptedAt) <= dateTo
            );
        }

        return filtered;
    });

    const currentPage = {
        index: ref(-1),
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
                filteredLogs.value.length,
                currentPage.index.value * ITEMS_PER_PAGE
            );
        }),
        content: computed(() => {
            if (currentPage.index.value === -1) {
                return [];
            }
            return filteredLogs.value.slice(
                (currentPage.index.value - 1) * ITEMS_PER_PAGE,
                currentPage.index.value * ITEMS_PER_PAGE
            );
        }),
    };

    watch(filters.search, resetPagination);
    watch(filters.success, resetPagination);
    watch(filters.ipAddress, resetPagination);
    watch(filters.dateFrom, resetPagination);
    watch(filters.dateTo, resetPagination);

    function resetPagination() {
        if (filteredLogs.value.length === 0) {
            currentPage.index.value = -1;
        } else {
            currentPage.index.value = 1;
        }
    }

    function resetFilters() {
        filters.search.value = "";
        filters.success.value = [];
        filters.ipAddress.value = "";
        filters.dateFrom.value = null;
        filters.dateTo.value = null;
    }

    function reset() {
        hash.value = {};
        sortedLogs.value = [];
        hasLoaded.value = false;
        resetPagination();
        resetFilters();
    }

    return {
        loaded: computed(() => hasLoaded.value),
        filters,
        currentPage,
        numberOfPages: computed(() => {
            if (filteredLogs.value.length === 0) {
                return 0;
            }
            return Math.ceil(filteredLogs.value.length / ITEMS_PER_PAGE);
        }),
        total: computed(() => filteredLogs.value.length),

        async fetchList() {
            const apiFilters = {};

            if (filters.search.value) {
                apiFilters.email = filters.search.value;
            }

            if (filters.ipAddress.value) {
                apiFilters.ipAddress = filters.ipAddress.value;
            }

            if (filters.success.value.length === 1) {
                apiFilters.success = filters.success.value[0] === "success";
            }

            if (filters.dateFrom.value) {
                apiFilters.dateFrom = filters.dateFrom.value;
            }

            if (filters.dateTo.value) {
                apiFilters.dateTo = filters.dateTo.value;
            }

            const logs = await list(apiFilters);

            hash.value = {};
            logs.forEach((log) => {
                hash.value[log.id] = log;
            });
            sortedLogs.value = logs;

            hasLoaded.value = true;

            return logs;
        },

        reset,
    };
});
