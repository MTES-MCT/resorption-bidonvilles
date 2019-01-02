import NavBar from '#app/layouts/navbar/navbar.vue';
import FilterGroup from './filterGroup/filterGroup.vue';
import Map from './map/map.vue';
import Table from './table/table.vue';
import Quickview from '#app/components/quickview/quickview.vue';
import { all as fetchAll } from '#helpers/api/town';
import { get as getConfig } from '#helpers/api/config';

export default {
    components: {
        NavBar,
        FilterGroup,
        Map,
        Table,
        Quickview,
    },
    data() {
        return {
            error: undefined,
            loading: false,
            defaultMapView: {
                center: getConfig().user.map_center,
                zoom: 9,
            },
            towns: [],
            quickview: {
                town: null,
                originEvent: null,
            },
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
                        { value: null, label: 'Inconnu', checked: true },
                        { value: '-9', label: 'Moins de 10 personnes', checked: true },
                        { value: '10-99', label: 'Entre 10 et 99 personnes', checked: true },
                        { value: '100-', label: '100 personnes et plus', checked: true },
                    ],
                },
                {
                    label: 'Procédure judiciaire en cours',
                    id: 'justice',
                    options: [
                        { value: 'no', label: 'Non', checked: true },
                        { value: 'yes', label: 'Oui', checked: true },
                    ],
                },
                {
                    label: 'Actions en cours',
                    id: 'action',
                    options: [
                        { value: 'no', label: 'Non', checked: true },
                        { value: 'yes', label: 'Oui', checked: true },
                    ],
                },
            ],
            currentTab: 'map',
        };
    },
    computed: {
        rendererProps() {
            if (this.currentTab === 'map') {
                return {
                    towns: this.visibleTowns,
                    defaultView: this.defaultMapView,
                };
            }

            return {
                towns: this.visibleTowns,
            };
        },
        visibleTowns() {
            let visibleTowns = this.towns;

            this.filters.forEach((filterGroup) => {
                switch (filterGroup.id) {
                case 'fieldType': {
                    const allowedFieldTypes = filterGroup.options
                        .filter(option => option.checked)
                        .map(option => option.value);

                    visibleTowns = visibleTowns.filter(town => allowedFieldTypes.indexOf(town.fieldType.id) !== -1);
                }
                    break;

                case 'population': {
                    const disallowedPopulation = filterGroup.options
                        .filter(option => !option.checked)
                        .map(option => option.value);

                    disallowedPopulation.forEach((value) => {
                        if (value === null) {
                            visibleTowns = visibleTowns.filter(town => town.populationTotal !== null);
                            return;
                        }

                        let [min, max] = value.split('-');
                        min = parseInt(min, 10);
                        max = parseInt(max, 10);

                        visibleTowns = visibleTowns.filter((town) => {
                            if (town.populationTotal === null) {
                                return true;
                            }

                            if (!Number.isNaN(min)
                            && !Number.isNaN(max)) {
                                return town.populationTotal < min || town.populationTotal > max;
                            }

                            if (!Number.isNaN(min)) {
                                return town.populationTotal < min;
                            }

                            if (!Number.isNaN(max)) {
                                return town.populationTotal > max;
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
                            visibleTowns = visibleTowns.filter(town => town.justiceStatus !== true);
                        } else if (value === 'no') {
                            visibleTowns = visibleTowns.filter(town => town.justiceStatus === true);
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
        showQuickview(town, event) {
            this.quickview = {
                town,
                originEvent: event.originalEvent,
            };
        },
        hideQuickview() {
            this.quickview = {
                town: null,
                originEvent: null,
            };
        },
        setTab(name) {
            this.currentTab = name;
        },
        fetchData() {
            if (this.loading === true) {
                return;
            }

            this.loading = true;
            this.error = undefined;

            fetchAll()
                .then((towns) => {
                    const { field_types: fieldTypes } = getConfig();

                    this.loading = false;

                    // build the field-type filter
                    const fieldTypeFilter = this.filters.filter(({ id }) => id === 'fieldType')[0];
                    fieldTypeFilter.options = [
                        // options based on field-types returned by the api
                        ...fieldTypes.map(fieldType => ({
                            id: fieldType.id,
                            value: fieldType.id,
                            label: fieldType.label,
                            checked: true,
                        })),
                    ];

                    this.towns = towns;
                })
                .catch((errors) => {
                    this.error = errors.user_message;
                    this.loading = false;
                });
        },
    },
};
