<template>
    <PrivateLayout>
        <div class="bg-G100 print:hidden">
            <PrivateContainer class="py-6">
                <h1 class="text-display-md text-center mb-4">
                    Rechercher un contact, une structure, les acteurs d'un
                    territoire ?
                </h1>
                <GeoSearchbar
                    :value="$store.state.directory.filters.location"
                    @blur="handleSearchBlur"
                    placeholder="Département, nom de la structure"
                    :allowShowAll="false"
                />
            </PrivateContainer>
        </div>
        <PrivateContainer class="pt-4 pb-16">
            <OrganizationListHeader
                class="mb-4"
                :locationImg="locationImg"
                :title="title"
                :nbOrganizations="filteredOrganizations.length"
                :nbUsers="nbUsers"
            />
            <OrganizationListFiltersPagination
                class="mb-4"
                :filters="$store.state.directory.filters"
                @update:intervention="
                    val => $store.commit('setDirectoryInterventionFilter', val)
                "
                @update:organizationType="
                    val =>
                        $store.commit('setDirectoryOrganizationTypeFilter', val)
                "
                :nbPages="nbPages"
                :currentPage="currentPage"
                :onChangePage="onChangePage"
            />
            <div v-if="!directoryLoading">
                <OrganizationCard
                    v-for="organization in filteredOrganizationsByPage"
                    :key="organization.id"
                    :organization="organization"
                    class="mb-2"
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
            <div v-else>
                <div class="text-center text-primary text-display-lg mt-16">
                    <Spinner />
                </div>
            </div>
        </PrivateContainer>
    </PrivateLayout>
</template>
<script>
import PrivateLayout from "#app/components/PrivateLayout";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import GeoSearchbar from "#app/components/GeoSearchbar/GeoSearchbar.vue";
import OrganizationListHeader from "./OrganizationListHeader";
import OrganizationListFiltersPagination from "./OrganizationListFiltersPagination";
import OrganizationCard from "./OrganizationCard";
import Pagination from "#app/components/ui/Pagination";
import { mapGetters } from "vuex";

export default {
    components: {
        Pagination,
        PrivateLayout,
        PrivateContainer,
        GeoSearchbar,
        OrganizationListHeader,
        OrganizationListFiltersPagination,
        OrganizationCard
    },
    methods: {
        async load() {
            // on fetch les activités
            if (this.$store.state.directory.items.length === 0) {
                this.$store.dispatch("fetchDirectory");
            }
        },
        onChangePage(newPage) {
            this.$store.commit("setDirectoryPage", newPage);
        },
        handleSearchBlur(data) {
            this.$store.commit("setDirectoryLocationFilter", data.value);
            this.$store.commit("setDirectorySearchFilter", data.search);
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
            const isRegion = locationFilter && locationFilter.type === "Région";
            const isUnsupportedRegion =
                isRegion && unsupportedRegions.includes(locationFilter.code);

            if (!locationFilter || isUnsupportedRegion) {
                return "/img/regions/fallback.svg";
            }

            if (isRegion) {
                return `/img/regions/${locationFilter.code}.svg`;
            }

            return `/img/departements/${locationFilter.departement}.svg`;
        },
        currentLocation() {
            return (
                this.$store.state.directory.filters.location || {
                    id: null,
                    label: "France",
                    category: "Pays",
                    data: {
                        code: null,
                        type: "nation"
                    }
                }
            );
        },
        title() {
            if (this.$store.state.directory.filters.location) {
                return `${this.$store.state.directory.filters.location.label}`;
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
