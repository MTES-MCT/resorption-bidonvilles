<template>
    <PrivateLayout>
        <div class="v1">
            <Export
                v-if="exportIsVisible"
                :towns="[]"
                @close="hideExport"
                :location="currentLocation"
                :closedTowns="filters.status === 'close'"
            ></Export>
        </div>
        <div class="bg-G100">
            <PrivateContainer class="py-6">
                <h1 class="text-display-sm text-center mb-4">
                    Rechercher un site, une commune, un département... ?
                </h1>
                <TownsListSearchBar v-model="filters.location" />
            </PrivateContainer>
        </div>
        <PrivateContainer class="pt-10">
            <TownsListHeader :search="filters.location" class="mb-12">
                <template slot="filters">
                    <TownsListHeaderTab
                        :active="filters.status === 'open'"
                        @click="filters.status = 'open'"
                        class="mr-8"
                        >Sites existants</TownsListHeaderTab
                    >
                    <TownsListHeaderTab
                        :active="filters.status === 'close'"
                        @click="filters.status = 'close'"
                        >Site fermés</TownsListHeaderTab
                    >
                </template>
                <template slot="title">
                    <div class="text-display-xl mb-2">{{ title }}</div>
                    <div>{{ populationTotal }} personnes</div>
                    <div>
                        {{ filteredShantytowns.length }} sites
                        <span v-if="hasJusticePermission && justiceTotal.length"
                            >dont {{ justiceTotal }} site(s) avec une procédure
                            judiciaire</span
                        >
                    </div>
                </template>
                <template slot="buttons">
                    <Button
                        icon="file-excel"
                        iconPosition="left"
                        variant="primary"
                        class="mr-6"
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
                        >
                            Déclarer un nouveau site</Button
                        ></router-link
                    >
                </template>
            </TownsListHeader>
            <div class="flex items-end mb-8 justify-between">
                <TownsListFilters class="">
                    <TownsListFilter
                        title="Nombre de personnes"
                        class="mr-2"
                        v-model="filters.population"
                        :options="[
                            { value: null, label: 'Inconnu' },
                            { value: '-9', label: 'Moins de 10 personnes' },
                            {
                                value: '10-99',
                                label: 'Entre 10 et 99 personnes'
                            },
                            { value: '100-', label: 'Plus de 100 personnes' }
                        ]"
                    />
                    <TownsListFilter
                        title="Type de terrain"
                        class="mr-2"
                        v-model="filters.fieldType"
                        :options="
                            fieldTypes.map(f => ({
                                label: f.label,
                                value: f.id
                            }))
                        "
                    />
                    <TownsListFilter
                        title="Procédure judiciaire"
                        class="mr-2"
                        v-model="filters.justice"
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
                </TownsListFilters>
                <Pagination
                    v-if="nbPages > 1"
                    :currentPage="currentPage"
                    :nbPages="nbPages"
                    :onChangePage="onChangePage"
                />
            </div>

            <TownCard
                v-for="shantytown in filteredShantytownsByPage"
                :key="shantytown.id"
                :shantytown="shantytown"
                class="mb-6"
            />
        </PrivateContainer>
    </PrivateLayout>
</template>

<script>
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer.vue";
import PrivateLayout from "#app/components/PrivateLayout";
import { all as fetchAll } from "#helpers/api/town";
import TownCard from "./TownCard";
import enrichShantytown from "./enrichShantytown";
import TownsListSearchBar from "./TownsListSearchBar";
import TownsListHeader from "./TownsListHeader/TownsListHeader";
import TownsListHeaderTab from "./TownsListHeader/TownsListHeaderTab";
import TownsListFilters from "./TownsListFilters/TownsListFilters";
import TownsListFilter from "./TownsListFilters/TownsListFilter";
import {
    get as getConfig,
    getPermission,
    hasPermission
} from "#helpers/api/config";
import { filterShantytowns } from "./filterShantytowns";
import Export from "#app/components/export/export.vue";

const PER_PAGE = 10;

export default {
    components: {
        TownCard,
        PrivateContainer,
        PrivateLayout,
        TownsListSearchBar,
        TownsListHeader,
        TownsListHeaderTab,
        TownsListFilters,
        TownsListFilter,
        Export
    },
    data() {
        const { field_types: fieldTypes } = getConfig();
        const permission = getPermission("shantytown.list");

        return {
            filters: {
                population: [],
                fieldType: [],
                justice: [],
                status: "open",
                location: null
            },
            currentPage: 1,
            hasNationalPermission: permission.geographic_level === "nation",
            hasJusticePermission: permission.data_justice === true,
            shantytowns: [],
            error: null,
            state: null,
            fieldTypes,
            exportIsVisible: false
        };
    },
    methods: {
        onChangePage(page) {
            this.currentPage = page;
        },
        hasPermission(...args) {
            return hasPermission(...args);
        },
        /**
         * Tries fetching the data from the API
         *
         * Please note that this cannot be done if the data has already been loaded
         * before.
         */
        load() {
            // loading data is forbidden if the component is already loading or loaded
            if ([null, "error"].indexOf(this.state) === -1) {
                return;
            }

            this.state = "loading";
            this.error = null;

            fetchAll().then(shantytowns => {
                console.log(shantytowns);
                this.shantytowns = shantytowns.map(s =>
                    enrichShantytown(s, this.fieldTypes)
                );
                this.state = "loaded";
            });
        },
        showExport() {
            setTimeout(() => {
                this.exportIsVisible = true;
            }, 100);
        },

        hideExport() {
            this.exportIsVisible = false;
        }
    },
    created() {
        this.load();
    },
    computed: {
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
        filteredShantytowns() {
            return filterShantytowns(this.shantytowns, this.filters);
        },
        filteredShantytownsByPage() {
            return this.filteredShantytowns.slice(
                (this.currentPage - 1) * PER_PAGE,
                PER_PAGE * this.currentPage
            );
        },
        title() {
            if (this.currentLocation.code) {
                return `${this.currentLocation.label}`;
            }

            return `Bidonvilles et squats`;
        },
        nbPages() {
            return Math.ceil(this.filteredShantytowns.length / PER_PAGE);
        }
    }
};
</script>
