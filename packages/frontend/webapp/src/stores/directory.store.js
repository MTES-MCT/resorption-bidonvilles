import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useEventBus } from "@common/helpers/event-bus";
import { useUserStore } from "@/stores/user.store";
import { list, get } from "@/api/organizations.api";
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
            return organization.intervention_areas.areas.some((area) => {
                const a = area[filters.location.value.typeUid];

                if (!a) {
                    return false;
                }

                if (a.code === `${filters.location.value.code}`) {
                    return true;
                }

                return a.main === `${filters.location.value.code}`;
            });
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
        return (organization?.users || []).filter((user) => {
            return user?.expertise_topics?.some((topic) =>
                expertiseTopicsIds.includes(topic.uid)
            );
        });
    }

    function filterByExpertiseTopics(list) {
        if (filters.expertiseTopics.value.length === 0) {
            return list;
        }

        return (
            list
                // on clone tous les objets ici car on souhaite muter ces objets plus bas
                // (précisément : modifier `users` pour les filtrer également par expertise topics)
                .map((org) => ({ ...org }))
                .filter((organization) => {
                    organization.users = filterUsersByExpertiseTopics(
                        organization,
                        filters.expertiseTopics.value
                    );

                    return organization.users.length > 0;
                })
        );
    }

    const { bus } = useEventBus();
    watch(() => bus.value.get("new-user"), resetFilters);
    resetFilters();

    function enrichOrganization(org) {
        const location = computeOrganizationLocation(org);
        org.location_name = location.name;
        org.location_code = location.code;
        return org;
    }

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
        async get(requestedId) {
            const index = organizations.value.findIndex(
                ({ id }) => id === requestedId
            );
            if (index >= 0) {
                return organizations.value[index];
            }

            try {
                const response = await get(requestedId);
                return enrichOrganization(response);
            } catch (error) {
                throw error.user_message
                    ? error
                    : new Error("Une erreur inconnue est survenue");
            }
        },
        async fetchDirectory() {
            if (isLoading.value === true) {
                return;
            }

            isLoading.value = true;
            error.value = null;
            try {
                const response = await list();
                organizations.value =
                    response.organizations.map(enrichOrganization);
                currentPage.index.value = 1;
            } catch (e) {
                error.value = e?.code || "Erreur inconnue";
            }

            isLoading.value = false;
        },
    };
});
