import { defineStore } from "pinia";
import { ref } from "vue";
import { list } from "@/api/activities.api";
import prepareActivityFilterForApi from "@/utils/prepareActivityFilterForApi";

export const useDashboardActivitiesStore = defineStore(
    "dashboardActivities",
    () => {
        const activities = ref([]);
        const isLoading = ref(null);
        const error = ref(null);
        const filters = {
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
                const rawActivities = await list(
                    prepareActivityFilterForApi(
                        lastActivityDate.value * 1000,
                        filters.properties.value,
                        target.numberOfActivities || 10,
                        loaded.locationType.value,
                        loaded.locationCode.value,
                        target.maxDate
                    )
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

        function resetPage() {
            activities.value = [];
            lastActivityDate.value = new Date();
            endOfActivities.value = false;
            loaded.locationType.value = null;
            loaded.locationCode.value = null;
            loaded.filters.value = [];
        }

        return {
            activities,
            isLoading,
            error,
            loaded,
            endOfActivities,
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
        };
    }
);
