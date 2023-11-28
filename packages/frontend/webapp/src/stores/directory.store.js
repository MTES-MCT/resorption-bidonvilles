import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useEventBus } from "@common/helpers/event-bus";
import { useUserStore } from "@/stores/user.store";
import { get } from "@/api/directory.api";
import computeOrganizationLocation from "@/utils/computeOrganizationLocation";
import Fuse from "fuse.js";
import getDefaultLocationFilter from "@/utils/getDefaultLocationFilter";

const ITEMS_PER_PAGE = 20;

export const useDirectoryStore = defineStore("directory", () => {
    const organizations = ref([]);
    const filters = {
        search: ref(""),
        location: ref(null),
        organizationTypes: ref([]),
        expertiseTopics: ref([]),
    };
    const fuse = computed(
        () =>
            new Fuse(organizations.value, {
                threshold: 0.1,
                shouldSort: false,
                keys: [
                    "name",
                    "abbreviation",
                    "users.first_name",
                    "users.last_name",
                ],
            })
    );
    const filteredOrganizations = computed(() => {
        let filtered = organizations.value;
        if (filters.location.value) {
            filtered = filterByLocation(filtered);
        } else if (filters.search.value) {
            filtered = filterBySearch();
        }

        filtered = filterByOrganizationTypes(filtered);
        return filterByExpertiseTopics(filtered);
        // return filtered;
    });
    const isLoading = ref(null);
    const error = ref(null);
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
                filteredOrganizations.value.length,
                currentPage.index.value * ITEMS_PER_PAGE
            );
        }),
        content: computed(() => {
            if (currentPage.index.value === -1) {
                return [];
            }

            return filteredOrganizations.value.slice(
                (currentPage.index.value - 1) * ITEMS_PER_PAGE,
                currentPage.index.value * ITEMS_PER_PAGE
            );
        }),
    };
    watch(filters.search, resetPagination);
    watch(filters.location, resetPagination);
    watch(filters.organizationTypes, resetPagination);
    watch(filters.expertiseTopics, resetPagination);

    function resetPagination() {
        if (filteredOrganizations.value.length === 0) {
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
        filters.organizationTypes.value = [];
        filters.expertiseTopics.value = [];
    }

    function filterByLocation(list) {
        if (!filters.location.value || filters.location.typeUid === "nation") {
            return list;
        }

        return list.filter((organization) => {
            const l = organization.location[filters.location.value.typeUid];

            if (!l) {
                return false;
            }

            if (l.code === `${filters.location.value.code}`) {
                return true;
            }

            return l.main === `${filters.location.value.code}`;
        });
    }
    function filterBySearch() {
        return fuse.value.search(filters.search.value).map(({ item }) => item);
    }
    function filterByOrganizationTypes(list) {
        if (filters.organizationTypes.value.length === 0) {
            return list;
        }

        return list.filter((organization) => {
            return filters.organizationTypes.value.includes(
                organization.type.category
            );
        });
    }

    function filterUsersByExpertiseTopics(organization, expertiseTopicsIds) {
        return organization.users.filter((user) => {
            return (
                user.expertise_topics &&
                user.expertise_topics.some((topic) =>
                    expertiseTopicsIds.includes(topic.id)
                )
            );
        });
    }

    function filterByExpertiseTopics(list) {
        // Vérifiez si le filtre contient (au moins) une valeur
        if (filters.expertiseTopics.value.length === 0) {
            // Pour chaque organisation, filtrer les utilisateurs en fonction du nouveau filtre
            for (const organization of list) {
                if (
                    Object.prototype.hasOwnProperty.call(
                        organization,
                        "allUsers"
                    )
                ) {
                    organization.users = organization.allUsers;
                }
            }

            return list;
        }

        // Filtrer les organisations qui ont au moins un utilisateur avec l'un des expertiseTopicsIds donné
        const filteredOrganizations = list.filter((organization) => {
            // Vérifier si l'organisation a la propriété 'users'
            if (!organization.users) {
                // Sans users impossible de vérifier l'étendue des compétences de la structure
                return [];
            }

            // Si organization.allUsers est null, c'est qu'on n'a pas encore filtré. On peut donc initialiser cette prop
            if (!organization.allUsers) {
                organization.allUsers = organization.users;
            } else {
                // Sinon, on réinitialise les organization.users avec la liste initiale
                organization.users = organization.allUsers;
            }

            // Mise à jouir de la liste des utilisateurs
            const filteredUsers = filterUsersByExpertiseTopics(
                organization,
                filters.expertiseTopics.value
            );
            organization.users = filteredUsers;

            // Ne renvoyer que les organisations qui ont au moins un utilisateur correspondant au filtre
            return filteredUsers.length > 0;
        });

        return filteredOrganizations;
    }

    const { bus } = useEventBus();
    watch(() => bus.value.get("new-user"), resetFilters);
    resetFilters();

    return {
        currentPage,
        numberOfPages: computed(() => {
            if (filteredOrganizations.value.length === 0) {
                return 0;
            }

            return Math.ceil(
                filteredOrganizations.value.length / ITEMS_PER_PAGE
            );
        }),
        total: computed(() => filteredOrganizations.value.length),
        isLoaded: computed(() => organizations.value.length > 0),
        isLoading,
        error,
        organizations,
        filteredOrganizations,
        filters,
        async fetchDirectory() {
            if (isLoading.value === true) {
                return;
            }

            isLoading.value = true;
            error.value = null;
            try {
                const response = await get();
                organizations.value = response.organizations.map((org) => {
                    const location = computeOrganizationLocation(org);
                    org.location_name = location.name;
                    org.location_code = location.code;
                    return org;
                });
                currentPage.index.value = 1;
            } catch (e) {
                error.value = e?.code || "Erreur inconnue";
            }

            isLoading.value = false;
        },
    };
});
