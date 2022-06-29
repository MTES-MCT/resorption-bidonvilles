import { getDirectory } from "#frontend/common/api/user";

export default {
    state: {
        loading: false,
        error: null,
        items: [],
        sort: "date",
        filters: {
            organizationType: [],
            location: null,
            search: null
        },
        currentPage: 1,
        itemsPerPage: 20
    },

    mutations: {
        setDirectoryLoading(state, loading) {
            state.loading = loading;
        },
        setDirectoryError(state, error) {
            state.error = error;
        },
        setDirectory(state, items) {
            state.items = items;
        },
        setDirectoryOrganizationTypeFilter(state, filters) {
            state.filters.organizationType = filters;
        },
        setDirectoryLocationFilter(state, location) {
            state.filters.location = location;
        },
        setDirectorySearchFilter(state, filters) {
            state.filters.search = filters;
        },
        setDirectoryPage(state, page) {
            state.currentPage = page;
        },
        updateOrganization(state, data) {
            const index = state.items.findIndex(({ id }) => id === data.id);

            if (index >= 0) {
                state.items.splice(index, 1, {
                    ...state.items[index],
                    ...data.partial
                });
            }
        }
    },

    actions: {
        setUserLocation({ commit, rootState }) {
            const { user } = rootState.config.configuration;
            if (user.organization.location.type !== "nation") {
                commit("setDirectoryLocationFilter", {
                    id:
                        user.organization.location[
                            user.organization.location.type
                        ].code,
                    label:
                        user.organization.location[
                            user.organization.location.type
                        ].name,
                    category: user.organization.location.type,
                    locationType: user.organization.location.type,
                    code:
                        user.organization.location[
                            user.organization.location.type
                        ].code,
                    data: {
                        code:
                            user.organization.location[
                                user.organization.location.type
                            ].code,
                        type: user.organization.location.type
                    }
                });
            }
        },
        async fetchDirectory({ commit, dispatch }) {
            commit("setDirectoryLoading", true);
            commit("setDirectoryError", null);

            try {
                dispatch("setUserLocation");

                const { organizations } = await getDirectory();

                const enrichedOrganizations = organizations.map(org => ({
                    ...org,
                    locationName:
                        org.location.type === "nation"
                            ? "National"
                            : org.location[org.location.type].name,
                    locationCode:
                        org.location.type === "nation"
                            ? ""
                            : org.location[org.location.type].code
                }));

                commit("setDirectory", enrichedOrganizations);
            } catch (error) {
                commit(
                    "setDirectoryError",
                    (error && error.user_message) || "Une erreur est survenue"
                );
            }

            commit("setDirectoryLoading", false);
        }
    },

    getters: {
        directoryItemsPerPage(state) {
            return state.itemsPerPage;
        },
        directoryCurrentPage(state) {
            return state.currentPage;
        },
        directory(state) {
            return state.items;
        },
        directoryLoading(state) {
            return state.loading;
        },
        directoryError(state) {
            return state.error;
        },
        directoryFilteredItems(state) {
            const { filters } = state;

            const result = state.items.filter(item => {
                if (filters.location && !checkLocation(item, filters)) {
                    return false;
                }

                if (
                    !filters.location &&
                    filters.search &&
                    !checkSearch(item, filters.search)
                ) {
                    return false;
                }

                if (
                    filters.organizationType &&
                    !checkOrganizationType(item, filters.organizationType)
                ) {
                    return false;
                }

                return true;
            });

            return result;
        },
        organization(state) {
            return id => {
                return state.items.find(item => item.id === id);
            };
        }
    }
};

function checkSearch(organization, search) {
    return (
        !!organization.name?.match(new RegExp(search, "ig")) ||
        !!organization.abbreviation?.match(new RegExp(search, "ig")) ||
        !!organization.users.some(
            user =>
                `${user.first_name} ${user.last_name}`.match(
                    new RegExp(search, "ig")
                ) ||
                `${user.last_name} ${user.first_name}`.match(
                    new RegExp(search, "ig")
                )
        )
    );
}

function checkLocation(organization, filters) {
    if (filters.location.type === "nation") {
        return true;
    }

    const l = organization.location[filters.location.locationType];

    if (!l) {
        return false;
    }

    if (l.code === `${filters.location.code}`) {
        return true;
    }

    return l.main === `${filters.location.code}`;
}

function checkOrganizationType(organization, organizationTypes) {
    if (!organizationTypes.length) {
        return true;
    }

    return organizationTypes.some(type => organization.type.category === type);
}
