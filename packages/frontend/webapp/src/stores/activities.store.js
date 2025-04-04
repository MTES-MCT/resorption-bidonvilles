import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useEventBus } from "@common/helpers/event-bus";
import { useUserStore } from "@/stores/user.store";
import getDefaultLocationFilter from "@/utils/getDefaultLocationFilter";
import prepareActivityFilterForApi from "@/utils/prepareActivityFilterForApi";
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

    async function fetchActivities(target = {}) {
        if (isLoading.value === true) {
            return;
        }

        error.value = null;
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
            let rawActivities = await list(
                prepareActivityFilterForApi(
                    lastActivityDate.value * 1000,
                    filters.properties.value,
                    target.numberOfActivities || 10,
                    loaded.locationType.value,
                    loaded.locationCode.value,
                    target.maxDate
                )
            );

            const overseasRegions = ["01", "02", "03", "04", "06"];
            rawActivities = rawActivities.filter((activity) => {
                if (target.location?.locationType === "metropole") {
                    return (
                        (activity.entity === "shantytown" &&
                            !overseasRegions.includes(
                                activity.shantytown.region?.code
                            )) ||
                        activity.entity !== "shantytown"
                    );
                }
                return activity;
            });

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

    function fetchDefault() {
        return fetchActivities({
            location: {
                locationType: filters.location.value?.typeUid || "nation",
                locationCode: filters.location.value?.code,
            },
        });
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
        loaded.locationType.value = null;
        loaded.locationCode.value = null;
        loaded.filters.value = [];
    }

    function refetch() {
        resetPage();
        fetchDefault();
    }

    const { bus } = useEventBus();
    watch(() => bus.value.get("new-user"), reset);
    reset();

    watch(filters.search, refetch);
    watch(filters.properties, refetch, {
        deep: true,
    });

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
        removeComment(commentId) {
            const index = activities.value.findIndex(({ comment }) => {
                return comment?.id === commentId;
            });

            if (index !== -1) {
                activities.value.splice(index, 1);
            }
        },
        fetch: fetchActivities,
        fetchDefault,
        fetchNext() {
            return fetchActivities();
        },
    };
});
