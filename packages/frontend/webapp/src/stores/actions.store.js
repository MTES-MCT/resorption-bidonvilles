import { defineStore } from "pinia";
import { ref, watch, computed, toRef } from "vue";
import { useEventBus } from "@common/helpers/event-bus";
import { useUserStore } from "@/stores/user.store";
import { useConfigStore } from "@/stores/config.store";
import { useNotificationStore } from "@/stores/notification.store";
import { useActivitiesStore } from "./activities.store";
import { useDashboardActivitiesStore } from "./dashboard.activities.store";
import {
    create,
    edit,
    fetchList,
    fetchOne,
    addComment,
    deleteComment,
    requestPilot,
} from "@/api/actions.api";
import getDefaultLocationFilter from "@/utils/getDefaultLocationFilter";
import filterActions from "@/utils/filterActions";
import { deleteAttachment } from "@/api/attachments.api";

const ITEMS_PER_PAGE = 10;

export const useActionsStore = defineStore("actions", () => {
    const actions = ref([]);
    const hash = ref({});
    const isLoading = ref(null);
    const error = ref(null);
    const filters = {
        status: ref("open"),
        search: ref(""),
        location: ref(null),
        properties: ref({}),
    };
    const requestedPilotsForActions = ref([]);

    const filteredActions = computed(() => {
        const STATUSES = ["open", "closed"];
        return Object.fromEntries(
            STATUSES.map((status) => [
                status,
                filterActions(actions.value, {
                    status,
                    search: filters.search.value,
                    location: filters.location.value,
                    ...filters.properties.value,
                }),
            ])
        );
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
                filteredActions.value[filters.status.value].length,
                currentPage.index.value * ITEMS_PER_PAGE
            );
        }),
        content: computed(() => {
            if (currentPage.index.value === -1) {
                return [];
            }

            return filteredActions.value[filters.status.value].slice(
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
        if (filteredActions.value[filters.status.value].length === 0) {
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
        actions.value = [];
        isLoading.value = false;
        error.value = null;
        resetPagination();
        resetFilters();
    }

    const { bus } = useEventBus();
    watch(() => bus.value.get("new-user"), reset);
    reset();

    async function fetchActions() {
        if (isLoading.value === true) {
            return;
        }

        isLoading.value = true;
        error.value = null;
        try {
            const rawActions = await fetchList();
            actions.value = rawActions;
            hash.value = actions.value.reduce((hash, action) => {
                hash[action.id] = action;
                return hash;
            }, {});
            currentPage.index.value = rawActions.length > 0 ? 1 : -1;
        } catch (e) {
            error.value =
                e?.code ||
                e?.user_message ||
                "Une erreur inconnue est survenue";
        }

        isLoading.value = false;
    }

    function setAction(actionId, action) {
        hash.value[actionId] = action;

        const index = actions.value.findIndex(({ id }) => id === actionId);
        if (index !== -1) {
            actions.value.splice(index, 1, hash.value[actionId]);
        }
    }

    function updateActionComments(id, comments) {
        if (hash.value[id]) {
            hash.value[id].comments = comments;
        }
    }

    return {
        actions,
        isLoading,
        error,
        filters,
        filteredActions,
        currentPage,
        hash,
        requestedPilotsForActions,
        resetFilters,
        numberOfPages: computed(() => {
            if (filteredActions.value[filters.status.value].length === 0) {
                return 0;
            }

            return Math.ceil(
                filteredActions.value[filters.status.value].length /
                    ITEMS_PER_PAGE
            );
        }),
        async create(data) {
            const { action, permissions } = await create(data);
            const configStore = useConfigStore();
            configStore.setPermissions(permissions);

            hash.value[action.id] = action;
            actions.value.push(action);

            return action;
        },

        async edit(actionId, data) {
            const { action, permissions } = await edit(actionId, data);
            const configStore = useConfigStore();
            configStore.setPermissions(permissions);

            setAction(actionId, action);
            return hash.value[action.id];
        },

        fetchActions,
        async fetchAction(actionId) {
            if (!hash.value[actionId]) {
                hash.value[actionId] = await fetchOne(actionId);
            }

            return toRef(hash.value, actionId);
        },
        async addComment(actionId, comment, attachments) {
            const notificationStore = useNotificationStore();
            const response = await addComment(actionId, comment, attachments);

            if (hash.value[actionId]) {
                hash.value[actionId].comments.unshift(response.comment);
            }

            notificationStore.success(
                "Publication d'un message",
                getCommentNotificationMessage(response.numberOfObservers)
            );
        },
        async deleteComment(actionId, commentId, reason = "") {
            const activitiesStore = useActivitiesStore();
            const dashboardActivitiesStore = useDashboardActivitiesStore();

            const { comments } = await deleteComment(
                actionId,
                commentId,
                reason
            );

            updateActionComments(commentId, comments);
            if (hash.value[actionId]) {
                hash.value[actionId].comments = hash.value[
                    actionId
                ].comments.filter((comment) => comment.id !== commentId);
            }
            activitiesStore.removeComment(commentId);
            dashboardActivitiesStore.removeComment(commentId);
        },
        async deleteCommentAttachment(file, { actionId, commentId }) {
            await deleteAttachment(file.id);
            const commentIndex = hash.value[actionId].comments.findIndex(
                ({ id }) => id === commentId
            );

            if (commentIndex === -1) {
                return;
            }

            const fileIndex = hash.value[actionId].comments[
                commentIndex
            ].attachments.findIndex(({ id }) => id === file.id);
            if (fileIndex === -1) {
                return;
            }

            hash.value[actionId].comments[commentIndex].attachments.splice(
                fileIndex,
                1
            );
        },
        async requestPilotAction(actionId) {
            const notificationStore = useNotificationStore();
            const response = await requestPilot(actionId);

            if (response) {
                requestedPilotsForActions.value.push(actionId);
                notificationStore.success(
                    "Succès",
                    "Votre demande de pilote sur l'action a bien été transmise."
                );
                return response;
            } else {
                notificationStore.error(
                    "Erreur",
                    "Nous n'avons pas pu transmettre votre demande de pilote. Veuillez réessayer plus tard."
                );
            }
        },
    };
});

function getCommentNotificationMessage(numberOfObservers) {
    if (numberOfObservers === 1) {
        return "Votre message est bien enregistré et a été envoyé par mail aux acteurs concernés de votre département";
    }

    if (numberOfObservers > 1) {
        return `Votre message est bien enregistré et a été envoyé par mail aux ${numberOfObservers} acteurs concernés de votre département`;
    }

    // cas où le nombre d'observateurs est à 0 (si l'envoi des mails a échoué côté API)
    return "Votre message est bien enregistré mais nous n'avons pas pu envoyer de notification par mail aux acteurs concernés";
}
