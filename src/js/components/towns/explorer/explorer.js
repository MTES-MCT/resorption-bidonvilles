import NavBar from '#src/components/navbar/navbar.vue';
import FilterGroup from './filterGroup/filterGroup.vue';
import Map from './map/map.vue';
import Table from './table/table.vue';

export default {
    components: {
        NavBar,
        FilterGroup,
        Map,
        Table,
    },
    data() {
        return {
            center: [43.3050621, 0.684586],
            recompute: 0,
            loading: true,
            towns: [],
            filters: [
                {
                    label: 'Types de site',
                    id: 'fieldType',
                    options: [],
                },
                {
                    label: 'Nombre de personnes',
                    id: 'population',
                    options: [
                        { value: null, label: 'Inconnu' },
                        { value: '-9', label: 'Moins de 10 personnes' },
                        { value: '10-99', label: 'Entre 10 et 99 personnes' },
                        { value: '100-', label: '100 personnes et plus' },
                    ],
                },
                {
                    label: 'Procédure judiciaire en cours',
                    id: 'justice',
                    options: [
                        { value: 'no', label: 'Non' },
                        { value: 'yes', label: 'Oui' },
                    ],
                },
                {
                    label: 'Actions en cours',
                    id: 'action',
                    options: [
                        { value: 'no', label: 'Non' },
                        { value: 'yes', label: 'Oui' },
                    ],
                },
            ],
            currentTab: 'map',
        };
    },
    computed: {
        visibleTowns() {
            this.recompute += 1;
            let visibleTowns = this.towns;

            this.filters.forEach((filterGroup) => {
                switch (filterGroup.id) {
                case 'fieldType': {
                    const allowedFieldTypes = filterGroup.options
                        .filter(option => option.checked)
                        .map(option => option.value);

                    visibleTowns = visibleTowns.filter(town => allowedFieldTypes.indexOf(town.field_type_id) !== -1);
                }
                    break;

                case 'population': {
                    const disallowedPopulation = filterGroup.options
                        .filter(option => !option.checked)
                        .map(option => option.value);

                    disallowedPopulation.forEach((value) => {
                        if (value === null) {
                            visibleTowns = visibleTowns.filter(town => town.population_total !== null);
                            return;
                        }

                        let [min, max] = value.split('-');
                        min = parseInt(min, 10);
                        max = parseInt(max, 10);

                        visibleTowns = visibleTowns.filter((town) => {
                            if (!Number.isNaN(min)
                            && !Number.isNaN(max)
                            && town.population_total >= min
                            && town.population_total <= max) {
                                return false;
                            }

                            if (!Number.isNaN(min) && town.population_total >= min) {
                                return false;
                            }

                            if (!Number.isNaN(max) && town.population_total <= max) {
                                return false;
                            }

                            return true;
                        });
                    });
                }
                    break;

                case 'justice': {
                    const disallowedJustice = filterGroup.options
                        .filter(option => !option.checked)
                        .map(option => option.value);

                    disallowedJustice.forEach((value) => {
                        if (value === 'yes') {
                            visibleTowns = visibleTowns.filter(town => town.justice_status === false);
                        } else if (value === 'no') {
                            visibleTowns = visibleTowns.filter(town => town.justice_status === true);
                        }
                    });
                }
                    break;

                case 'action': {
                    const disallowedActions = filterGroup.options
                        .filter(option => !option.checked)
                        .map(option => option.value);

                    disallowedActions.forEach((value) => {
                        if (value === 'yes') {
                            visibleTowns = visibleTowns.filter(town => town.actions.length === 0);
                        } else if (value === 'no') {
                            visibleTowns = visibleTowns.filter(town => town.actions.length > 0);
                        }
                    });
                }
                    break;

                default:
                }
            });

            return visibleTowns;
        },
        currentTabComponent() {
            return this.currentTab === 'map' ? Map : Table;
        },
    },
    created() {
        this.fetchData();
    },
    methods: {
        onFilterChange() {
            this.recompute += 1;
        },
        setTab(name) {
            this.currentTab = name;
        },
        fetchData() {
            this.loading = true;

            setTimeout(() => {
                const response = {
                    towns: [
                        {
                            latitude: 43.641668,
                            longitude: 1.467486,
                            city: 'Toulouse',
                            address: 'Gramont : avenue d\'Atlanta',
                            field_type: 'Terrain',
                            field_type_id: 1,
                            population_total: 40,
                            population_couples: null,
                            population_minors: null,
                            built_at: '01/08/2013',
                            owner_type: 'public',
                            justice_status: false,
                            actions: [],
                        },
                    ],
                    fieldTypes: [
                        { id: 1, name: 'Terrain' },
                        { id: 2, name: 'Immeuble bâti' },
                    ],
                };

                // build the field-type filter
                const fieldTypeFilter = this.filters.filter(({ id }) => id === 'fieldType')[0];
                fieldTypeFilter.options = [
                    // special option 'unknown'
                    { id: -1, value: -1, label: 'Inconnu' },

                    // options based on field-types returned by the api
                    ...response.fieldTypes.map(fieldType => ({
                        id: fieldType.id,
                        value: fieldType.id,
                        label: fieldType.name,
                    })),
                ];

                this.towns = response.towns;
                this.checkAllFilters();
                this.loading = false;
            }, 10);
        },
        checkAllFilters() {
            this.filters.forEach((filter) => {
                filter.options.forEach((option) => {
                    option.checked = true;
                });
            });
        },
    },
};
