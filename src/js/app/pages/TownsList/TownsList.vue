<template>
    <PrivateLayout>
        <PrivateContainer>
            <TownsListSearchBar
                v-model="filters.location"
                class="mt-12 mb-12"
            />
            <TownsListHeader :search="filters.location" class="mb-12">
                <TownsListHeaderTab
                    :active="filters.status === 'open'"
                    @click="filters.status = 'open'"
                    class="mr-2"
                    >Site existants</TownsListHeaderTab
                >
                <TownsListHeaderTab
                    :active="filters.status === 'close'"
                    @click="filters.status = 'close'"
                    >Site fermés</TownsListHeaderTab
                >
            </TownsListHeader>
            <TownsListFilters class="mb-8">
                <TownsListFilter
                    title="Nombre de personnes"
                    class="mr-2"
                    v-model="filters.population"
                    :options="[
                        { value: null, label: 'Inconnu' },
                        { value: '-9', label: 'Moins de 10 personnes' },
                        { value: '10-99', label: 'Entre 10 et 99 personnes' },
                        { value: '100-', label: 'Plus de 100 personnes' }
                    ]"
                />
                <TownsListFilter
                    title="Type de terrain"
                    class="mr-2"
                    v-model="filters.fieldType"
                    :options="
                        fieldTypes.map(f => ({ label: f.label, value: f.id }))
                    "
                />
                <TownsListFilter
                    title="Procédure judiciaire"
                    class="mr-2"
                    v-model="filters.justice"
                    :options="[
                        { value: null, label: 'Inconnu' },
                        { value: 'none', label: 'Aucune' },
                        { value: 'ownerComplaint', label: 'Plainte déposée' },
                        {
                            value: 'justiceProcedure',
                            label: 'Procédure en cours'
                        },
                        { value: 'justiceRendered', label: 'Décision rendue' }
                    ]"
                />
            </TownsListFilters>

            <TownCard
                v-for="shantytown in filteredShantytowns"
                :key="shantytown.id"
                :shantytown="shantytown"
                class="mb-8"
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
import { get as getConfig } from "#helpers/api/config";
import { filterShantytowns } from "./filterShantytowns";

export default {
    components: {
        TownCard,
        PrivateContainer,
        PrivateLayout,
        TownsListSearchBar,
        TownsListHeader,
        TownsListHeaderTab,
        TownsListFilters,
        TownsListFilter
    },
    data() {
        const { field_types: fieldTypes } = getConfig();

        return {
            filters: {
                population: [],
                fieldType: [],
                justice: [],
                status: "open",
                location: null
            },
            shantytowns: [],
            error: null,
            state: null,
            fieldTypes
        };
    },
    methods: {
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
        }
    },
    created() {
        this.load();
    },
    computed: {
        filteredShantytowns() {
            return filterShantytowns(this.shantytowns, this.filters);
        }
    }
};
</script>
