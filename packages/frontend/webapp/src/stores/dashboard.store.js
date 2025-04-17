import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";
import { useEventBus } from "@common/helpers/event-bus";
import { useUserStore } from "@/stores/user.store";
import { useTownsStore } from "@/stores/towns.store";
import { useDashboardActivitiesStore } from "./dashboard.activities.store";
import { getDashboard as getDashboardStats } from "@/api/statistics.api";
import formatGlobalStats from "@/utils/formatGlobalStats";
import getDefaultLocationFilter from "@/utils/getDefaultLocationFilter";
import getSince from "@/utils/getSince";
import isTownInsideLocation from "@/utils/isTownInsideLocation";
import computeLocationSearchTitle from "@/utils/computeLocationSearchTitle";

export const useDashboardStore = defineStore("dashboard", () => {
    const townsStore = useTownsStore();
    const dashboardActivitiesStore = useDashboardActivitiesStore();
    const filters = {
        search: ref(""),
        location: ref(null),
    };
    const stats = {
        data: ref([]),
        isLoading: ref(null),
        error: ref(null),
        mapView: ref({
            center: [46.7755829, 2.0497727],
            zoom: 6,
        }),
    };
    const towns = {
        filter: ref("my_shantytowns"),
        display: ref("thumbnail"),
        page: ref(1),
        data: {
            my_territory: computed(() => {
                return townsStore.towns.filter(
                    (town) =>
                        town.status === "open" &&
                        isTownInsideLocation(town, filters.location.value)
                );
            }),
            my_shantytowns: computed(() => {
                return towns.data.my_territory.value.filter((town) => {
                    return town.actors.some(
                        ({ id }) => id === userStore.user?.id
                    );
                });
            }),
            new_shantytowns: computed(() => {
                return towns.data.my_territory.value.filter((town) => {
                    const { days } = getSince(town.createdAt);
                    return days < 30;
                });
            }),
            shantytowns_with_target: computed(() => {
                return towns.data.my_territory.value.filter((town) => {
                    return town.resorptionTarget !== null;
                });
            }),
            currentTab: computed(() => {
                return towns.data[towns.filter.value].value;
            }),
        },
    };
    const activities = {
        filter: ref("comment_creation"),
    };

    const formattedActivities = computed(() => {
        return dashboardActivitiesStore.activities.reduce(
            (acc, argActivity) => {
                const activity = { ...argActivity };
                if (activity.entity === "user") {
                    const dateObj = new Date(activity.date * 1000);
                    dateObj.setMinutes(0, 0, 0);

                    activity.normalizedDate = dateObj.getTime() / 1000; // Reconvertir en secondes
                }

                if (activity.user) {
                    const matchingActivityIndex = acc.findIndex(
                        (prevActivity) =>
                            prevActivity.users &&
                            prevActivity.users.length > 0 &&
                            prevActivity.users[0].organization ===
                                activity.user.organization &&
                            prevActivity.normalizedDate ===
                                activity.normalizedDate
                    );

                    // Si une activité avec la même organisation et la même date normalisée existe déjà
                    if (matchingActivityIndex !== -1) {
                        const newAcc = [...acc];
                        newAcc[matchingActivityIndex].users.push(activity.user);
                        return newAcc;
                    }

                    // Sinon, créer une nouvelle entrée avec users
                    activity.users = [activity.user];
                    delete activity.user;
                }
                if (
                    activity.entity === "shantytown" &&
                    activity.action === "update"
                ) {
                    const updates = activity.diff.reduce((diffAcc, diff) => {
                        if (
                            ![
                                "livingConditions.water.access_is_local",
                                "livingConditions.electricity.access",
                            ].includes(diff.fieldKey)
                        ) {
                            return diffAcc;
                        }

                        const oldValue = diff.oldValue
                            ? diff.oldValue.toLowerCase()
                            : diff.oldValue;
                        const newValue = diff.newValue
                            ? diff.newValue.toLowerCase()
                            : diff.newValue;
                        let action = null;

                        if (oldValue !== "oui" && newValue === "oui") {
                            action = "creation";
                        } else if (oldValue === "oui" && newValue !== "oui") {
                            action = "closing";
                        } else {
                            return diffAcc;
                        }

                        return [
                            ...diffAcc,
                            {
                                entity:
                                    diff.fieldKey ===
                                    "livingConditions.electricity.access"
                                        ? "electricity"
                                        : "water",
                                action,
                                date: activity.date,
                                shantytown: activity.shantytown,
                            },
                        ];
                    }, []);

                    if (updates.length === 0) {
                        return acc;
                    }

                    return [...acc, ...updates];
                }

                return [...acc, activity];
            },
            []
        );
    });
    const userStore = useUserStore();
    const defaultLocationFilter = computed(() => {
        return getDefaultLocationFilter(userStore.user);
    });

    function resetFilters() {
        // global
        const { search: searchFilter, data: locationFilter } =
            defaultLocationFilter.value;

        filters.search.value = searchFilter;
        filters.location.value = locationFilter;

        // towns
        towns.filter.value = "my_shantytowns";
        towns.display.value = "thumbnail";
        towns.page.value = 1;
    }

    const { bus } = useEventBus();
    watch(() => bus.value.get("new-user"), resetFilters);
    resetFilters();

    return {
        stats,
        filters,
        setTownFilter(id) {
            towns.filter.value = id;
            towns.page.value = 1;
        },
        currentLocationName: computed(() => {
            return computeLocationSearchTitle(
                filters.search.value,
                filters.location.value
            );
        }),
        isOnDefaultLocation: computed(() => {
            return userStore.isMyLocation({
                search: filters.search.value,
                data: filters.location.value,
            });
        }),
        towns,
        activities,
        formattedActivities,
        async fetchStats() {
            if (stats.isLoading.value === true) {
                return;
            }

            stats.isLoading.value = true;
            stats.error.value = null;
            try {
                const rawStats = await getDashboardStats(
                    filters.location.value?.typeUid,
                    filters.location.value?.code
                );

                stats.data.value = formatGlobalStats(rawStats);
            } catch (e) {
                stats.error.value =
                    e?.code ||
                    e?.user_message ||
                    "Une erreur inconnue est survenue";
            }

            stats.isLoading.value = false;
        },
    };
});
