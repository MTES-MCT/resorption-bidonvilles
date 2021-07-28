<template>
    <PrivateLayout>
        <Export
            v-if="exportIsVisible"
            :towns="[]"
            @close="hideExport"
            :location="currentLocation"
            :closedTowns="filters.status !== 'open'"
        ></Export>

        <div class="bg-G100 print:hidden">
            <PrivateContainer class="py-6">
                <h1 class="text-display-md text-center mb-4">
                    Rechercher un site, une commune, un département... ?
                </h1>
                <GeoSearchbar
                    :value="filters.location"
                    @blur="handleSearchBlur"
                />
            </PrivateContainer>
        </div>
        <PrivateContainer class="pt-10">
            <EventBannerPlatform></EventBannerPlatform>
            <EventBannerContribute></EventBannerContribute>
            <EventBannerVaccination></EventBannerVaccination>

            <TownsListHeader :search="filters.location" class="mb-6">
                <template slot="filters">
                    <TownsListHeaderTab
                        :active="filters.status === 'open'"
                        @click="onClickOpenTab"
                        class="mr-8"
                        >Sites existants</TownsListHeaderTab
                    >
                    <TownsListHeaderTab
                        :active="filters.status === 'close'"
                        @click="onClickCloseTab"
                        >Sites fermés</TownsListHeaderTab
                    >
                </template>
                <template slot="title">
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="text-display-xl mb-2">{{ title }}</div>
                            <div class="flex items-center" v-if="!isLoading">
                                <div class="mr-4">
                                    <img
                                        :src="locationImg"
                                        width="80"
                                        height="80"
                                    />
                                </div>
                                <div>
                                    <div>
                                        <div>
                                            {{ populationTotal }} personnes
                                        </div>
                                        <div>
                                            {{ filteredShantytowns.length }}
                                            sites
                                        </div>
                                        <div
                                            v-if="
                                                hasJusticePermission &&
                                                    justiceTotal
                                            "
                                        >
                                            {{ justiceTotal }} site(s) avec une
                                            procédure judiciaire
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="flex-1 text-center text-primary text-display-md"
                            v-if="activitiesLoading"
                        >
                            <Spinner />
                        </div>
                        <div class="flex-1 mt-6 pl-12 max-w-2xl" v-else>
                            <div v-if="lastActivities.length > 0">
                                <h1 class="font-bold text-md border-b mb-2">
                                    Les activités des derniers jours
                                </h1>
                                <ActivityCard
                                    v-for="(activity, index) in lastActivities"
                                    :key="index"
                                    variant="small"
                                    :activity="activity"
                                />
                                <Button
                                    variant="primaryText"
                                    class="text-display-sm hover:underline mt-4"
                                    :padding="false"
                                    :href="historyPath"
                                    >Voir toutes les activités sur ce
                                    territoire</Button
                                >
                            </div>

                            <div v-else class="mt-12">
                                <h1 class="font-bold text-xl">
                                    Aucune activité sur ce territoire depuis 1
                                    semaine
                                </h1>
                                <p>
                                    Vous ou vos équipes, avez-vous effectué des
                                    actions ?<br />Si oui, informez-en la
                                    communauté !
                                </p>
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
                        v-if="hasPermission('shantytown.export')"
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
                        v-if="hasPermission('shantytown.create')"
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
                        <TownsListFilter
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
                    <Sort
                        :value="sort"
                        @input="updateSort"
                        :options="sortOptions[filters.status]"
                        class="mb-2"
                    />
                </div>

                <div>
                    <TownCard
                        v-for="shantytown in printMode
                            ? filteredShantytowns
                            : filteredShantytownsByPage"
                        :key="shantytown.id"
                        :shantytown="shantytown"
                        :hasJusticePermission="hasJusticePermission"
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
import getSince from "#app/pages/TownsList/getSince";
import ActivityCard from "#app/components/ActivityCard/ActivityCard.vue";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer.vue";
import PrivateLayout from "#app/components/PrivateLayout";
import EventBannerPlatform from "#app/components/EventBannerPlatform";
import EventBannerContribute from "#app/components/EventBannerContribute";
import EventBannerVaccination from "#app/components/EventBannerVaccination";
import TownCard from "./TownCard";
import GeoSearchbar from "#app/components/GeoSearchbar/GeoSearchbar.vue";
import TownsListHeader from "./TownsListHeader/TownsListHeader";
import TownsListHeaderTab from "./TownsListHeader/TownsListHeaderTab";
import TownsListFilters from "./TownsListFilters/TownsListFilters";
import {
    get as getConfig,
    getPermission,
    hasPermission
} from "#helpers/api/config";
import { filterShantytowns } from "./filterShantytowns";
import Export from "#app/components/export2/Export.vue";
import Spinner from "#app/components/ui/Spinner";
import store from "#app/store";
import { mapGetters } from "vuex";

const PER_PAGE = 20;

export default {
    components: {
        Spinner,
        TownCard,
        ActivityCard,
        EventBannerPlatform,
        EventBannerContribute,
        EventBannerVaccination,
        PrivateContainer,
        PrivateLayout,
        GeoSearchbar,
        TownsListHeader,
        TownsListHeaderTab,
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
        const { field_types: fieldTypes } = getConfig();
        const permission = getPermission("shantytown.list");

        return {
            hasJusticePermission: permission.data_justice === true,
            fieldTypes,
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
                ]
            }
        };
    },
    methods: {
        handleSearchBlur(data) {
            this.$trackMatomoEvent("Liste des sites", "Recherche");

            store.commit("setFilters", {
                ...this.filters,
                location: data.value,
                search: data.search
            });
        },
        onClickCloseTab() {
            this.updateFilters("status", "close");
            this.updateSort("cityName");
        },
        onClickOpenTab() {
            this.updateFilters("status", "open");
            this.updateSort("cityName");
        },
        updateSort(val) {
            store.commit("setSort", val);
        },
        updateFilters(filter, val) {
            store.commit("setFilters", { ...this.filters, [filter]: val });
            this.onChangePage(1);
        },
        onChangePage(page) {
            store.commit("setCurrentPage", page);
        },
        hasPermission(...args) {
            return hasPermission(...args);
        },
        load() {
            if (!this.shantytowns.length) {
                store.dispatch("fetchTowns");
            }

            if (!this.activities.length) {
                store.dispatch("fetchActivities");
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
            activitiesLoading: "activitiesLoading",
            error: "townsError",
            filters: "townsFilters",
            sort: "townsSort",
            currentPage: "townsCurrentPage",
            activities: "activities"
        }),
        isLoading() {
            return this.townsLoading;
        },
        filteredActivities() {
            if (!this.filters.location) {
                return this.activities;
            }

            return this.activities.filter(item => {
                const { code, type } = this.filters.location.data;
                return item.shantytown[type].code === code;
            });
        },
        lastActivities() {
            return this.filteredActivities.slice(0, 3).filter(({ date }) => {
                const { days } = getSince(date);
                return days <= 7;
            });
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

            return `France métropolitaine`;
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
        },
        historyPath() {
            const { type, code } = this.currentLocation.data;
            return `/activites/${type}${code ? `/${code}` : ""}`;
        }
    }
};
</script>
