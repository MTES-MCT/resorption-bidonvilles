import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useEventBus } from "@common/helpers/event-bus";
import { get, list, setRoleRegular } from "@/api/users.api";
import enrichUserWithAccessStatus from "@/utils/enrichUserWithAccessStatus";
import enrichUserWithLocationName from "@/utils/enrichUserWithLocationName";
import accessStatuses from "@/utils/access_statuses";
import Fuse from "fuse.js";

const ITEMS_PER_PAGE = 50;

export const useAccesStore = defineStore("acces", () => {
    const sortedAcces = ref([]);
    const hash = ref({});

    // filtres
    const fuse = computed(() => {
        return new Fuse(sortedAcces.value, {
            threshold: 0.2,
            shouldSort: false,
            keys: [
                "first_name",
                "last_name",
                "email",
                "organization.name",
                "organization.abbreviation",
                "location_name", // propriété "enriched"
                "role",
            ],
        });
    });
    const filters = {
        search: ref(""),
        status: ref([]),
    };
    const filteredAcces = computed(() => {
        let filtered = sortedAcces.value;
        if (filters.search.value) {
            filtered = fuse.value
                .search(filters.search.value)
                .map(({ item }) => item);
        }

        const statuses = filters.status.value;
        if (statuses.length === 0) {
            return filtered;
        }

        return filtered.filter((user) => {
            return statuses.includes(user.access_status.status);
        });
    });

    // pagination
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
                filteredAcces.value.length,
                currentPage.index.value * ITEMS_PER_PAGE
            );
        }),
        content: computed(() => {
            if (currentPage.index.value === -1) {
                return [];
            }

            return filteredAcces.value.slice(
                (currentPage.index.value - 1) * ITEMS_PER_PAGE,
                currentPage.index.value * ITEMS_PER_PAGE
            );
        }),
    };
    watch(filters.search, resetPagination);
    watch(filters.status, resetPagination);

    function resetPagination() {
        if (filteredAcces.value.length === 0) {
            currentPage.index.value = -1;
        } else {
            currentPage.index.value = 1;
        }
    }

    function resetFilters() {
        const defaultFilters = ["deactivated", "refused"];
        filters.search.value = "";
        filters.status.value = Object.keys(accessStatuses).filter(
            (status) => !defaultFilters.includes(status)
        );
    }

    function reset() {
        hash.value = {};
        sortedAcces.value = [];
        resetPagination();
        resetFilters();
    }

    const { bus } = useEventBus();
    watch(() => bus.value.get("new-user"), reset);
    reset();

    return {
        loaded: computed(() => sortedAcces.value.length > 0),
        filters,
        currentPage,
        numberOfPages: computed(() => {
            if (filteredAcces.value.length === 0) {
                return 0;
            }

            return Math.ceil(filteredAcces.value.length / ITEMS_PER_PAGE);
        }),
        total: computed(() => filteredAcces.value.length),

        async updateUserRole(userId, newRole, roles) {
            const updatedUser = await setRoleRegular(userId, newRole);
            if (updatedUser && hash.value[userId]) {
                hash.value[userId].role = roles.find(
                    (role) => role.id === newRole
                ).name;
                hash.value[userId].role_id = newRole;
            }
        },

        updateUser(userId, user) {
            if (hash.value[userId]) {
                enrichUserWithAccessStatus(user);
                enrichUserWithLocationName(user);
                hash.value[userId] = user;

                const index = sortedAcces.value.findIndex(
                    ({ id }) => id === userId
                );
                if (index !== -1) {
                    sortedAcces.value.splice(index, 1, user);
                }
            } else {
                // si l'utilisateur n'est pas dans le hash, on ignore car on ne peut pas facilement
                // intégrer ce nouvel utilisateur à la liste sortedAccess, car le tri n'est pas géré
                // côté front pour l'instant
                // @todo
            }
        },

        deleteUser(userId) {
            const index = sortedAcces.value.findIndex(
                (user) => user.id === userId
            );
            if (index === -1) {
                return;
            }

            delete hash.value[userId];
            sortedAcces.value.splice(index, 1);
        },

        async fetchList() {
            const users = (await list()).map((user) => {
                enrichUserWithAccessStatus(user); // nécessaire car le retour API n'apporte pas la nuance demande envoyée/expirée etc.
                enrichUserWithLocationName(user); // nécessaire pour la recherche par Fuse
                return user;
            });
            hash.value = {};
            users.forEach((user) => {
                hash.value[user.id] = user;
            });
            sortedAcces.value = users;
            return users;
        },

        async fetchUser(userId, refetch = false) {
            if (hash.value[userId] && refetch === false) {
                return computed(() => hash.value[userId] || null);
            }

            const user = await get(userId);
            if (!user) {
                throw {
                    code: "Utilisateur introuvable",
                    user_message:
                        "L'utilisateur demandé n'existe pas en base de données",
                };
            }

            hash.value[user.id] = user;
            return computed(() => hash.value[user.id] || null);
        },
    };
});
