<template>
    <PrivateLayout>
        <div class="bg-G200 print:hidden">
            <PrivateContainer class="py-6">
                <h1 class="text-display-md text-center mb-4">
                    Rechercher un contact, une structure, les acteurs d'un
                    territoire ?
                </h1>
                <GeoSearchbar
                    :value="$store.state.directory.filters.location"
                    @blur="handleSearchBlur"
                    placeholder="Département, nom de la structure"
                >
                    <template v-slot:extra="{ removeItem }">
                        <div class="py-1 text-right">
                            <Button
                                variant="primaryText"
                                @click="
                                    () => {
                                        removeItem();
                                        toggleUserLocation();
                                    }
                                "
                                size="sm"
                                class="font-bold"
                                >{{
                                    $store.state.directory.filters.location ||
                                    currentUser.organization.location.type ===
                                        "nation"
                                        ? "Voir tous les utilisateurs de France"
                                        : "Voir tous les utilisateurs de mon territoire"
                                }}</Button
                            >
                        </div>
                    </template>
                </GeoSearchbar>
            </PrivateContainer>
        </div>
        <PrivateContainer class="pt-4 pb-16">
            <OrganizationListHeader
                class="mb-8"
                :title="title"
                :locationImg="locationImg"
                :nbOrganizations="filteredOrganizations.length"
                :nbUsers="nbUsers"
            />
            <OrganizationListFiltersPagination
                class="mb-4"
                :filters="$store.state.directory.filters"
                @update:organizationType="updateOrganizationType"
                :nbPages="nbPages"
                :currentPage="currentPage"
                :onChangePage="onChangePage"
            />
            <div v-if="!directoryLoading">
                <OrganizationCard
                    v-for="organization in filteredOrganizationsByPage"
                    :key="organization.id"
                    :organization="organization"
                    class="mb-4"
                />
                <div class="mt-4 flex justify-end">
                    <Pagination
                        v-if="nbPages > 1"
                        :currentPage="currentPage"
                        :nbPages="nbPages"
                        :onChangePage="onChangePage"
                    />
                </div>
            </div>
            <LoadingPage v-if="loading" />
        </PrivateContainer>
    </PrivateLayout>
</template>
<script>
import PrivateLayout from "#app/components/PrivateLayout";
import LoadingPage from "#app/components/PrivateLayout/LoadingPage";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import GeoSearchbar from "#app/components/GeoSearchbar/GeoSearchbar.vue";
import OrganizationListHeader from "./OrganizationListHeader";
import OrganizationListFiltersPagination from "./OrganizationListFiltersPagination";
import OrganizationCard from "./OrganizationCard";
import Pagination from "#app/components/ui/Pagination";
import { mapGetters } from "vuex";
import { get as getConfig } from "#helpers/api/config";

export default {
    components: {
        Pagination,
        PrivateLayout,
        PrivateContainer,
        GeoSearchbar,
        OrganizationListHeader,
        OrganizationListFiltersPagination,
        OrganizationCard,
        LoadingPage
    },
    data() {
        const { user } = getConfig();
        return {
            currentUser: user
        };
    },
    methods: {
        async load() {
            if (this.$store.state.directory.items.length === 0) {
                this.$store.dispatch("fetchDirectory");
            }
        },
        toggleUserLocation() {
            this.$store.commit("setDirectorySearchFilter", "");
            if (
                this.$store.state.directory.filters.location ||
                this.currentUser.organization.location.type === "nation"
            ) {
                this.$store.commit("setDirectoryLocationFilter", null);
            } else {
                this.$store.dispatch("setUserLocation");
            }
        },
        onChangePage(newPage) {
            this.$store.commit("setDirectoryPage", newPage);
        },
        handleSearchBlur(data) {
            this.$store.commit("setDirectoryLocationFilter", data.value);
            this.$store.commit("setDirectorySearchFilter", data.search);
            this.$store.commit("setDirectoryPage", 1);
        },
        updateOrganizationType(val) {
            this.$store.commit("setDirectoryOrganizationTypeFilter", val);
            this.$store.commit("setDirectoryPage", 1);
        }
    },
    created() {
        this.load();
    },
    computed: {
        ...mapGetters({
            itemsPerPage: "directoryItemsPerPage",
            currentPage: "directoryCurrentPage",
            directoryLoading: "directoryLoading",
            loading: "activitiesLoading",
            error: "activitiesError",
            directory: "directory",
            directoryFilteredItems: "directoryFilteredItems",
            locations: "locations"
        }),
        locationImg() {
            // Guadeloupe, Martinique, Guyane, Réunion, Mayotte
            const unsupportedRegions = ["01", "02", "03", "04", "06"];
            const locationFilter = this.$store.state.directory.filters.location;
            const isNation = locationFilter && locationFilter.type === "nation";
            const isRegion =
                locationFilter && locationFilter.locationType === "region";
            const isDepartement =
                locationFilter && locationFilter.locationType === "departement";
            const isUnsupportedRegion =
                isRegion && unsupportedRegions.includes(locationFilter.code);

            if (!locationFilter || isNation || isUnsupportedRegion) {
                return "/img/regions/fallback.svg";
            }

            if (isRegion) {
                return `/img/regions/${locationFilter.code}.svg`;
            }

            if (isDepartement) {
                return `/img/departements/${locationFilter.code}.svg`;
            }

            return `/img/departements/${locationFilter.departement}.svg`;
        },
        title() {
            const {
                location: locationFilter,
                search: searchFilter
            } = this.$store.state.directory.filters;

            if (locationFilter && locationFilter.type !== "nation") {
                return locationFilter.label;
            }

            if (searchFilter) {
                return `« ${searchFilter} »`;
            }

            return `France métropolitaine`;
        },
        filteredOrganizations() {
            return this.directoryFilteredItems;
        },
        filteredOrganizationsByPage() {
            return this.filteredOrganizations.slice(
                (this.currentPage - 1) * this.itemsPerPage,
                this.itemsPerPage * this.currentPage
            );
        },
        nbPages() {
            return Math.ceil(
                this.filteredOrganizations.length / this.itemsPerPage
            );
        },
        elementsOnPage() {
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end =
                this.currentPage < this.nbPages
                    ? start + this.itemsPerPage - 1
                    : start +
                      (this.filteredOrganizations.length % this.itemsPerPage) -
                      1;

            return `${start} - ${end} sur ${this.filteredOrganizations.length}`;
        },
        nbUsers() {
            return this.filteredOrganizations.reduce((acc, item) => {
                return acc + item.users.length;
            }, 0);
        }
    }
};
</script>
