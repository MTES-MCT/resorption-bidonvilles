import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";
import { useEventBus } from "@common/helpers/event-bus";
import { trackEvent } from "@/helpers/matomo";
import { useUserStore } from "@/stores/user.store";
import { useActivitiesStore } from "./activities.store";
import { useDashboardActivitiesStore } from "./dashboard.activities.store";
import { useNotificationStore } from "./notification.store";
import { useConfigStore } from "./config.store";
import getDefaultLocationFilter from "@/utils/getDefaultLocationFilter";
import {
    addActor,
    addComment,
    create,
    deleteComment,
    destroy,
    edit,
    fetch,
    fetchList,
    findNearby,
    removeActor,
    removeActorTheme,
    setHeatwaveStatus,
    updateActorThemes,
} from "@/api/towns.api";
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
    const townCategoryFilter = ref([]);
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
        townCategoryFilter.value = [];
        resetPagination();
        resetFilters();
    }

    function updateShantytownComments(id, comments) {
        if (hash.value[id]) {
            hash.value[id].comments = comments;
        }
    }

    function setTown(townId, town) {
        hash.value[townId] = enrichShantytown(
            town,
            configStore.config.field_types
        );

        const index = towns.value.findIndex(({ id }) => id === townId);
        if (index !== -1) {
            towns.value.splice(index, 1, hash.value[townId]);
        }
    }

    const { bus } = useEventBus();
    watch(() => bus.value.get("new-user"), reset);
    reset();

    return {
        isLoading,
        error,
        filters,
        townCategoryFilter,
        towns,
        hash,
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
            const town = enrichShantytown(
                await fetch(townId),
                configStore.config.field_types
            );
            hash.value[town.id] = town;
            return town;
        },
        setTown,
        async destroy(townId) {
            await destroy(townId);

            const index = towns.value.findIndex(({ id }) => id === townId);
            if (index !== -1) {
                towns.value.splice(index, 1);
            }

            delete hash.value[townId];
            hash.value[townId] = undefined;
        },
        async addComment(shantytownId, comment, attachments) {
            const notificationStore = useNotificationStore();
            const { comments } = await addComment(
                shantytownId,
                comment,
                attachments
            );
            updateShantytownComments(shantytownId, {
                regular: comments.regular,
                covid: comments.covid,
            });

            trackEvent("Site", "Création commentaire", `S${shantytownId}`);
            notificationStore.success(
                "Publication d'un message",
                `Votre message est bien enregistré et a été envoyé par mail ${
                    comments.numberOfWatchers > 1
                        ? `aux ${comments.numberOfWatchers} acteurs concernés`
                        : `aux acteurs concernés`
                } de votre département`
            );
        },
        async deleteComment(shantytownId, commentId, reason = "") {
            const activitiesStore = useActivitiesStore();
            const dashboardActivitiesStore = useDashboardActivitiesStore();
            const { comments } = await deleteComment(
                shantytownId,
                commentId,
                reason
            );

            updateShantytownComments(shantytownId, comments);
            activitiesStore.removeComment(commentId);
            dashboardActivitiesStore.removeComment(commentId);
        },
        async deleteCommentAttachment(shantytownId, commentId, attachmentId) {
            console.log(shantytownId, commentId, attachmentId);
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

        async fetchNearbyTowns(townId) {
            if (!hash.value[townId]) {
                throw new Error(
                    "Cannot fetch nearby towns of a town that has not been fetched itself"
                );
            }

            const { towns } = await findNearby(
                hash.value[townId].latitude,
                hash.value[townId].longitude
            );
            hash.value[townId].nearbyTowns = towns.filter(
                ({ id }) => id !== townId
            );
        },

        async addActor(townId, userId, themes) {
            const response = await addActor(townId, {
                user_id: userId,
                themes,
            });

            // response.actors is not defined when an actor other than the connected user is added (we send an email to get his confirmation instead)
            if (response?.actors && hash.value[townId]) {
                hash.value[townId].actors = response.actors;
            }
        },

        async updateActor(townId, userId, themes) {
            const { themes: updatedThemes } = await updateActorThemes(
                townId,
                userId,
                themes
            );

            if (hash.value[townId]) {
                const actor = hash.value[townId].actors.find(
                    ({ id }) => id === userId
                );
                if (actor) {
                    actor.themes = updatedThemes;
                }
            }
        },

        async removeActor(townId, userId) {
            const { actors } = await removeActor(townId, userId);

            if (hash.value[townId]) {
                hash.value[townId].actors = actors;
            }
        },

        async removeActorTheme(townId, userId, themeId) {
            const { themes } = await removeActorTheme(townId, userId, themeId);

            if (hash.value[townId]) {
                const actor = hash.value[townId].actors.find(
                    ({ id }) => id === userId
                );
                if (actor) {
                    actor.themes = themes;
                }
            }
        },

        async create(data) {
            const { town } = await create(data);
            const enrichedTown = enrichShantytown(
                town,
                configStore.config.field_types
            );
            hash.value[town.id] = enrichedTown;
            towns.value.push(enrichedTown);

            return town;
        },

        async edit(townId, data) {
            const town = await edit(townId, data);
            setTown(townId, town);

            return hash.value[town.id];
        },
    };
});
