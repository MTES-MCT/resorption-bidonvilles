import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useEventBus } from "@/helpers/event-bus";
import { useUserStore } from "@/stores/user.store";
import getDefaultLocationFilter from "@/utils/getDefaultLocationFilter";
import { list } from "@/api/activities.api";

export const useActivitiesStore = defineStore("activities", () => {
    const activities = ref([]);
    const isLoading = ref(null);
    const error = ref(null);
    const filters = {
        search: ref(""),
        location: ref(null),
        activityTypes: ref([]),
    };
    const loaded = {
        locationType: ref(null),
        locationCode: ref(null),
        filters: ref([]),
    };
    const lastActivityDate = ref(new Date());
    const endOfActivities = ref(false);

    function reset() {
        const userStore = useUserStore();

        // filters
        const { search: searchFilter, data: locationFilter } =
            getDefaultLocationFilter(userStore.user);

        filters.search.value = searchFilter;
        filters.location.value = locationFilter;
        filters.activityTypes.value = [];

        // loaded
        loaded.locationType.value = null;
        loaded.locationCode.value = null;
        loaded.filters.value = [];
    }

    const { bus } = useEventBus();
    watch(() => bus.value.get("new-user"), reset);
    reset();

    return {
        activities,
        isLoading,
        error,
        filters,
        loaded,
        endOfActivities,
        async fetchActivities(target) {
            error.value = null;
            isLoading.value = true;

            if (target.location) {
                lastActivityDate.value = Date.now() / 1000;
                endOfActivities.value = false;
                activities.value = [];
                loaded.locationType.value = target.location.locationType;
                loaded.locationCode.value = target.location.locationCode;
                loaded.filters.value = filters.activityTypes.value
                    .map((v) => v.split("_"))
                    .flat();
            } else if (endOfActivities.value === true) {
                isLoading.value = false;
                return;
            }

            try {
                const rawActivities = await list(
                    lastActivityDate.value * 1000,
                    loaded.filters.value,
                    target.numberOfActivities || 10,
                    loaded.locationType.value,
                    loaded.locationCode.value,
                    target.maxDate
                );

                if (rawActivities.length > 0) {
                    lastActivityDate.value = rawActivities.slice(-1)[0].date;
                }

                if (
                    rawActivities.length === 0 ||
                    target.numberOfActivities === -1
                ) {
                    endOfActivities.value = true;
                }

                activities.value.push(...rawActivities);
            } catch (e) {
                error.value =
                    e?.code ||
                    e?.user_message ||
                    "Une erreur inconnue est survenue";
            }

            isLoading.value = false;
        },
    };
});
