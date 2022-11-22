import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";
import { useEventBus } from "@/helpers/event-bus";
import { useUserStore } from "@/stores/user.store";
import { fetchList } from "@/api/plans.api";
import getDefaultLocationFilter from "@/utils/getDefaultLocationFilter";
import filterPlans from "@/utils/filterPlans";

const ITEMS_PER_PAGE = 10;

export const usePlansStore = defineStore("plans", () => {
    const plans = ref([]);
    const hash = ref({});
    const isLoading = ref(null);
    const error = ref(null);
    const filters = {
        status: ref("open"),
        search: ref(""),
        location: ref(null),
        properties: ref({}),
    };

    const filteredPlans = computed(() => {
        return filterPlans(plans.value, {
            search: filters.search.value,
            location: filters.location.value,
            ...filters.properties.value,
        });
    });
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
                filteredPlans.value.length,
                currentPage.index.value * ITEMS_PER_PAGE
            );
        }),
        content: computed(() => {
            if (currentPage.index.value === -1) {
                return [];
            }

            return filteredPlans.value.slice(
                (currentPage.index.value - 1) * ITEMS_PER_PAGE,
                currentPage.index.value * ITEMS_PER_PAGE
            );
        }),
    };
    watch(filters.search, resetPagination);
    watch(filters.location, resetPagination);
    watch(filters.status, resetPagination);
    watch(filters.properties, resetPagination, { deep: true });

    function resetPagination() {
        if (filteredPlans.value.length === 0) {
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

        filters.properties.value.topic = [];
        filters.properties.value.interventionLocation = [];
    }

    function reset() {
        plans.value = [];
        isLoading.value = false;
        error.value = null;
        resetPagination();
        resetFilters();
    }

    const { bus } = useEventBus();
    watch(() => bus.value.get("new-user"), reset);
    reset();

    async function fetchPlans() {
        if (isLoading.value === true) {
            return;
        }

        isLoading.value = true;
        error.value = null;
        try {
            const rawPlans = await fetchList();
            plans.value = rawPlans;
            hash.value = rawPlans.reduce(
                (hash, { id }, index) => ({
                    ...hash,
                    [id]: index,
                }),
                {}
            );
            currentPage.index.value = rawPlans.length > 0 ? 1 : -1;
        } catch (e) {
            error.value =
                e?.code ||
                e?.user_message ||
                "Une erreur inconnue est survenue";
        }

        isLoading.value = false;
    }

    return {
        plans,
        isLoading,
        error,
        filters,
        filteredPlans,
        currentPage,
        numberOfPages: computed(() => {
            if (filteredPlans.value.length === 0) {
                return 0;
            }

            return Math.ceil(filteredPlans.value.length / ITEMS_PER_PAGE);
        }),
        fetchPlans,
        async fetchPlan(planId) {
            return plans.value[hash.value[planId]];
        },
    };
});
