import { defineStore } from "pinia";
import { ref, watch, computed, toRef } from "vue";
import { useEventBus } from "@/helpers/event-bus";
import { useUserStore } from "@/stores/user.store";
import { useConfigStore } from "@/stores/config.store";
import { useNotificationStore } from "@/stores/notification.store";
import {
    create,
    edit,
    fetchList,
    fetchOne,
    addComment,
} from "@/api/actions.api";
import getDefaultLocationFilter from "@/utils/getDefaultLocationFilter";
import filterActions from "@/utils/filterActions";

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

    const filteredActions = computed(() => {
        return filterActions(actions.value, {
            status: filters.status.value,
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
                filteredActions.value.length,
                currentPage.index.value * ITEMS_PER_PAGE
            );
        }),
        content: computed(() => {
            if (currentPage.index.value === -1) {
                return [];
            }

            return filteredActions.value.slice(
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
        if (filteredActions.value.length === 0) {
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

    return {
        actions,
        isLoading,
        error,
        filters,
        filteredActions,
        currentPage,
        numberOfPages: computed(() => {
            if (filteredActions.value.length === 0) {
                return 0;
            }

            return Math.ceil(filteredActions.value.length / ITEMS_PER_PAGE);
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
        async addComment(actionId, comment) {
            const notificationStore = useNotificationStore();
            const newComment = await addComment(actionId, comment);

            if (hash.value[actionId]) {
                hash.value[actionId].comments.unshift(newComment);
            }

            notificationStore.success(
                "Publication d'un message",
                "Votre message est bien enregistré et a été envoyé aux acteurs concernés de votre département par mail"
            );
        },
    };
});