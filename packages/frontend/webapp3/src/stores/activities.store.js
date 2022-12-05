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
        properties: ref({
            activityType: [],
            resorbed: [],
            myTowns: [],
        }),
    };
    const loaded = {
        locationType: ref(null),
        locationCode: ref(null),
        filters: ref([]),
    };
    const lastActivityDate = ref(new Date());
    const endOfActivities = ref(false);

    async function fetchActivities(target) {
        error.value = null;
        if (isLoading.value === true) {
            return;
        }
        isLoading.value = true;
        if (target.location) {
            lastActivityDate.value = Date.now() / 1000;
            endOfActivities.value = false;
            activities.value = [];
            loaded.locationType.value = target.location.locationType;
            loaded.locationCode.value = target.location.locationCode;
        } else if (endOfActivities.value === true) {
            isLoading.value = false;
            return;
        }

        try {
            const rawActivities = await list(
                lastActivityDate.value * 1000,
                filters.properties.value,
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
    }
    function reset() {
        const userStore = useUserStore();

        // filters
        const { search: searchFilter, data: locationFilter } =
            getDefaultLocationFilter(userStore.user);
        activities.value = [];
        filters.search.value = searchFilter;
        filters.location.value = locationFilter;
        filters.properties.value.activityType = [];
        filters.properties.value.resorbed = [];
        filters.properties.value.myTowns = [];

        // loaded
        loaded.locationType.value = null;
        loaded.locationCode.value = null;
        loaded.filters.value = [];
    }

    function resetPage() {
        activities.value = [];
        lastActivityDate.value = new Date();
        endOfActivities.value = false;
        if (filters.location.value?.typeUid) {
            fetchActivities({
                location: {
                    locationType: filters.location.value?.typeUid,
                    locationCode: filters.location.value?.code,
                },
            });
        }
    }
    function removeComment(commentId) {
        const index = activities.value.findIndex(({ comment }) => {
            return comment && comment.id === commentId;
        });

        if (index >= 0) {
            activities.value.splice(index, 1);
        }
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
        lastActivityDate,
        fetchActivities,
        reset,
        resetPage,
        removeComment,
    };
});
