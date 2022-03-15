<template>
    <PrivateLayout>
        <Export
            v-if="exportIsVisible"
            :towns="[]"
            @close="hideExport"
            :location="currentLocation"
            :closedTowns="filters.status !== 'open'"
        ></Export>

        <div class="bg-G200 print:hidden">
            <PrivateContainer class="py-6">
                <h1 class="text-display-md text-center mb-4">
                    Rechercher un site, une commune, un département... ?
                </h1>
                <GeoSearchbar
                    data-cy-input="geoFilter"
                    :value="filters.location"
                    :allowFreeInput="true"
                    @blur="handleSearchBlur"
                />
            </PrivateContainer>
        </div>
        <PrivateContainer class="pt-10">
            <EventBannerWaterAccess></EventBannerWaterAccess>

            <TownsListHeader :search="filters.location" class="mb-6">
                <template slot="filters">
                    <TabList :tabs="tabs" v-model="currentTab" />
                </template>
                <template slot="title">
                    <div class="text-display-xl mb-2">{{ title }}</div>
                    <div class="flex items-center" v-if="!isLoading">
                        <div class="mr-4">
                            <img :src="locationImg" width="80" height="80" />
                        </div>
                        <div>
                            <div>
                                <div>{{ populationTotal }} personnes</div>
                                <div data-cy="nbSites">
                                    {{ filteredShantytowns.length }}
                                    sites
                                </div>
                                <div
                                    v-if="hasJusticePermission && justiceTotal"
                                >
                                    {{ justiceTotal }} site(s) avec une
                                    procédure judiciaire
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template slot="buttons">
                    <Button
                        icon="print"
                        iconPosition="left"
                        variant="primaryOutline"
                        class="mr-6 mb-2 md:mb-0"
                        @click="togglePrintModal"
                        >Imprimer</Button
                    >
                    <Button
                        v-if="
                            $store.getters['config/hasPermission'](
                                'shantytown.export'
                            )
                        "
                        icon="file-excel"
                        iconPosition="left"
                        variant="primary"
                        class="mr-6 mb-2 md:mb-0"
                        :disabled="filteredShantytowns.length === 0"
                        @click="showExport"
                        >Exporter</Button
                    >
                    <router-link
                        to="/nouveau-site"
                        v-if="
                            $store.getters['config/hasPermission'](
                                'shantytown.create'
                            )
                        "
                        ><Button
                            icon="plus"
                            iconPosition="left"
                            variant="secondary"
                            class="whitespace-no-wrap"
                        >
                            Déclarer un nouveau site</Button
                        ></router-link
                    >
                </template>
            </TownsListHeader>
            <div v-if="!isLoading">
                <div
                    class="md:flex items-start mb-4 justify-between print:hidden"
                >
                    <TownsListFilters>
                        <CustomFilter
                            title="Type de sites"
                            class="mr-2 mb-2"
                            :value="filters.fieldType"
                            @input="val => updateFilters('fieldType', val)"
                            :options="
                                fieldTypes.map(f => ({
                                    label: f.label,
                                    value: f.id
                                }))
                            "
                        />
                        <CustomFilter
                            title="Nombre de personnes"
                            class="mr-2 mb-2"
                            :value="filters.population"
                            @input="val => updateFilters('population', val)"
                            :options="[
                                { value: null, label: 'Inconnu' },
                                { value: '-9', label: 'Moins de 10 personnes' },
                                {
                                    value: '10-99',
                                    label: 'Entre 10 et 99 personnes'
                                },
                                {
                                    value: '100-',
                                    label: 'Plus de 100 personnes'
                                }
                            ]"
                        />
                        <CustomFilter
                            title="Origines"
                            class="mr-2 mb-2"
                            :value="filters.origin"
                            @input="val => updateFilters('origin', val)"
                            :options="[
                                {
                                    value: 1,
                                    label: 'Français'
                                },
                                {
                                    value: 2,
                                    label: 'Union européenne'
                                },
                                {
                                    value: 3,
                                    label: 'Hors Union européenne'
                                },
                                {
                                    value: null,
                                    label: 'Inconnu'
                                }
                            ]"
                        />
                        <CustomFilter
                            v-if="filters.status === 'open'"
                            title="Conditions de vie"
                            class="mr-2 mb-2"
                            :value="filters.conditions"
                            @input="val => updateFilters('conditions', val)"
                            :options="[
                                {
                                    value: 'accessToWater',
                                    label: 'eau'
                                },
                                {
                                    value: 'accessToSanitary',
                                    label: 'toilettes'
                                },
                                {
                                    value: 'accessToElectricity',
                                    label: 'électricité'
                                },
                                {
                                    value: 'accessToTrash',
                                    label: 'évac. des déchets'
                                },

                                {
                                    value: 'vermin',
                                    label: 'pres. de nuisibles'
                                },
                                {
                                    value: 'firePreventionMeasures',
                                    label: 'prev. incendie'
                                }
                            ]"
                        >
                            <template v-slot:default="{ label }">
                                <div class="text-red flex items-center">
                                    <div class="mr-2">
                                        <Icon icon="times" />/<Icon
                                            icon="question"
                                            class="text-xs"
                                        />
                                    </div>
                                    {{ label }}
                                </div>
                            </template>
                        </CustomFilter>
                        <CustomFilter
                            v-if="filters.status === 'close'"
                            title="Cause de la fermeture"
                            class="mr-2 mb-2"
                            :value="filters.closingReason"
                            @input="val => updateFilters('closingReason', val)"
                            :options="
                                closingReasons.map(f => ({
                                    label: f.label,
                                    value: f.id
                                }))
                            "
                        />
                        <CustomFilter
                            v-if="filters.status === 'close'"
                            title="Résorbé / fermé"
                            class="mr-2 mb-2"
                            :value="filters.solvedOrClosed"
                            @input="val => updateFilters('solvedOrClosed', val)"
                            :options="[
                                {
                                    value: 'closed',
                                    label: 'Fermé'
                                },
                                {
                                    value: 'solved',
                                    label: 'Résorbé'
                                }
                            ]"
                        />
                        <CustomFilter
                            v-if="hasJusticePermission"
                            title="Procédure judiciaire"
                            class="mr-2 mb-2"
                            :value="filters.justice"
                            @input="val => updateFilters('justice', val)"
                            :options="[
                                { value: null, label: 'Inconnu' },
                                { value: 'none', label: 'Aucune' },
                                {
                                    value: 'ownerComplaint',
                                    label: 'Plainte déposée'
                                },
                                {
                                    value: 'justiceProcedure',
                                    label: 'Procédure en cours'
                                },
                                {
                                    value: 'justiceRendered',
                                    label: 'Décision rendue'
                                }
                            ]"
                        />
                        <CustomFilter
                            title="Intervenants"
                            class="mr-2 mb-2"
                            :value="filters.actors"
                            @input="val => updateFilters('actors', val)"
                            :options="[
                                { value: 'yes', label: 'Oui' },
                                { value: 'no', label: 'Non' }
                            ]"
                        />
                        <CustomFilter
                            title="Objectif résorption"
                            class="mr-2 mb-2"
                            :value="filters.target"
                            @input="val => updateFilters('target', val)"
                            :options="[
                                { value: 'yes', label: 'Oui' },
                                { value: 'no', label: 'Non' }
                            ]"
                        />
                    </TownsListFilters>
                    <div>
                        <div class="mb-2">Trier par</div>
                        <Sort
                            v-model="sort"
                            :options="sortOptions[filters.status]"
                            class="mb-2"
                        />
                    </div>
                </div>

                <div>
                    <TownCard
                        v-for="shantytown in printMode
                            ? filteredShantytowns
                            : filteredShantytownsByPage"
                        :key="shantytown.id"
                        :shantytown="shantytown"
                        :hasJusticePermission="hasJusticePermission"
                        :hasUpdateShantytownPermission="
                            hasLocalizedPermission(
                                'shantytown.update',
                                shantytown
                            )
                        "
                        class="mb-6"
                    />
                    <div
                        class="flex flex-col items-end mb-12 print:hidden mt-2"
                    >
                        <Pagination
                            class="md:mt-0 mb-2"
                            v-if="nbPages > 1"
                            :currentPage="currentPage"
                            :nbPages="nbPages"
                            :onChangePage="onChangePage"
                        />
                        <div class="pr-6 text-G600">{{ elementsOnPage }}</div>
                    </div>
                </div>

                <div
                    v-if="!filteredShantytowns.length"
                    class="text-center text-G600 italic pt-4"
                >
                    Aucun site ne correspond à votre recherche, essayez d'autres
                    filtres ou périmètre géographique
                </div>
            </div>

            <div v-else class="text-center text-primary text-display-lg mt-16">
                <Spinner />
            </div>
        </PrivateContainer>
    </PrivateLayout>
</template>

<script>
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer.vue";
import PrivateLayout from "#app/components/PrivateLayout";
import EventBannerWaterAccess from "#app/components/EventBannerWaterAccess";
import TownCard from "./TownCard";
import GeoSearchbar from "#app/components/GeoSearchbar/GeoSearchbar.vue";
import TownsListHeader from "./TownsListHeader/TownsListHeader";
import TabList from "#app/components/TabList/TabList.vue";
import TownsListFilters from "./TownsListFilters/TownsListFilters";
import { filterShantytowns } from "./filterShantytowns";
import Export from "#app/components/export2/Export.vue";
import Spinner from "#app/components/ui/Spinner";
import { mapGetters } from "vuex";

const PER_PAGE = 20;

export default {
    components: {
        Spinner,
        TownCard,
        EventBannerWaterAccess,
        PrivateContainer,
        PrivateLayout,
        GeoSearchbar,
        TownsListHeader,
        TabList,
        TownsListFilters,
        Export
    },
    mounted() {
        window.onbeforeprint = () => {
            this.printMode = true;
        };
        window.onafterprint = () => {
            this.printMode = false;
        };
    },
    data() {
        return {
            closingReasons: [
                {
                    id: "closed_by_justice",
                    label: "Exécution d'une décision de justice"
                },
                {
                    id: "closed_by_admin",
                    label: "Exécution d'une décision administrative"
                },
                { id: "other", label: "Autre" },
                { id: "unknown", label: "Raison inconnue" }
            ],
            exportIsVisible: false,
            printMode: false,
            sortOptions: {
                open: [
                    {
                        value: `cityName`,
                        label: `Commune`
                    },
                    {
                        value: `builtAt`,
                        label: `Date d'installation`
                    },
                    {
                        value: `updatedAt`,
                        label: `Date d'actualisation`
                    },
                    {
                        value: `declaredAt`,
                        label: `Date de signalement`
                    }
                ],
                close: [
                    {
                        value: `cityName`,
                        label: `Commune`
                    },
                    {
                        value: `closedAt`,
                        label: `Date de fermeture`
                    },
                    {
                        value: `updatedAt`,
                        label: `Date d'actualisation`
                    }
                ]
            },
            tabs: [
                { id: "open", label: "Sites existants" },
                { id: "close", label: "Sites fermés" }
            ],
            currentTab: "open"
        };
    },
    watch: {
        currentTab() {
            this.updateFilters("status", this.currentTab);

            if (this.currentTab === "close") {
                this.updateSort("closedAt");
            } else {
                this.updateSort("cityName");
            }
        }
    },
    methods: {
        handleSearchBlur(data) {
            this.$trackMatomoEvent("Liste des sites", "Recherche");
            this.$store.commit("setFilters", {
                ...this.filters,
                location: data.value,
                search: data.search
            });
            this.refreshActivities();
        },
        updateSort(val) {
            this.$store.commit("setSort", val);
        },
        updateFilters(filter, val) {
            this.$store.commit("setFilters", {
                ...this.filters,
                [filter]: val
            });
            this.onChangePage(1);
        },
        onChangePage(page) {
            this.$store.commit("setCurrentPage", page);
        },
        load() {
            if (!this.shantytowns.length) {
                this.$store.dispatch("fetchTowns");
            }
        },
        showExport() {
            setTimeout(() => {
                this.exportIsVisible = true;
            }, 100);
        },

        hideExport() {
            this.exportIsVisible = false;
        },
        togglePrintModal() {
            this.printMode = true;
            setTimeout(() => {
                window.print();
                this.$trackMatomoEvent(
                    "Impression",
                    "Impression liste des sites"
                );
            }, 100);
        }
    },
    created() {
        this.load();
    },
    computed: {
        ...mapGetters({
            shantytowns: "towns",
            townsLoading: "townsLoading",
            error: "townsError",
            filters: "townsFilters",
            currentPage: "townsCurrentPage",
            activities: "activities",
            hasLocalizedPermission: "config/hasLocalizedPermission"
        }),
        sort: {
            get() {
                return this.$store.state.towns.sort;
            },
            set(value) {
                this.updateSort(value);
            }
        },
        hasJusticePermission() {
            return (
                this.$store.getters["config/getPermission"](
                    "shantytown_justice.access"
                ) !== null
            );
        },
        fieldTypes() {
            return this.$store.state.config.configuration.field_types;
        },
        isLoading() {
            return this.townsLoading;
        },
        locationImg() {
            // Guadeloupe, Martinique, Guyane, Réunion, Mayotte
            const unsupportedRegions = ["01", "02", "03", "04", "06"];
            const locationFilter = this.filters.location;
            const isRegion = locationFilter && locationFilter.type === "Région";
            const isUnsupportedRegion =
                isRegion && unsupportedRegions.includes(locationFilter.code);
            // TODO : Remove when api will return departement
            const isInvalidDepartement =
                !isRegion && locationFilter && !locationFilter.departement;

            if (
                !locationFilter ||
                isInvalidDepartement ||
                isUnsupportedRegion
            ) {
                return "/img/regions/fallback.svg";
            }

            if (isRegion) {
                return `/img/regions/${this.filters.location.code}.svg`;
            }

            return `/img/departements/${this.filters.location.departement}.svg`;
        },
        currentLocation() {
            return (
                this.filters.location || {
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
        populationTotal() {
            return this.filteredShantytowns.reduce(
                (total, { populationTotal }) => total + (populationTotal || 0),
                0
            );
        },
        justiceTotal() {
            return this.filteredShantytowns.filter(
                ({ justiceProcedure }) => justiceProcedure === true
            ).length;
        },
        sortFn() {
            if (this.sort === "cityName") {
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
                return b[this.sort] - a[this.sort];
            };
        },
        filteredShantytowns() {
            return filterShantytowns(this.shantytowns, this.filters).sort(
                this.sortFn
            );
        },
        filteredShantytownsByPage() {
            return this.filteredShantytowns.slice(
                (this.currentPage - 1) * PER_PAGE,
                PER_PAGE * this.currentPage
            );
        },
        title() {
            if (this.filters.location) {
                return `${this.filters.location.label}`;
            }

            if (this.filters.search) {
                return `« ${this.filters.search} »`;
            }

            return `France`;
        },
        nbPages() {
            return Math.ceil(this.filteredShantytowns.length / PER_PAGE);
        },
        elementsOnPage() {
            const start = (this.currentPage - 1) * PER_PAGE + 1;
            const end =
                this.currentPage < this.nbPages
                    ? start + PER_PAGE - 1
                    : start + (this.filteredShantytowns.length % PER_PAGE) - 1;

            return `${start} - ${end} sur ${this.filteredShantytowns.length}`;
        }
    }
};
</script>
