import NavBar from '#app/layouts/navbar/navbar.vue';
import FilterGroup from './filterGroup/filterGroup.vue';
import Map from './map/map.vue';
import { VueGoodTable as Table } from 'vue-good-table';
import Quickview from '#app/components/quickview/quickview.vue';
import { all as fetchAll } from '#helpers/api/town';
import { get as getConfig } from '#helpers/api/config';
import simplebar from 'simplebar-vue';
// eslint-disable-next-line
import iconType from '/img/type.svg';
// eslint-disable-next-line
import iconPeople from '/img/people.svg';
// eslint-disable-next-line
import iconJustice from '/img/justice.svg';
// eslint-disable-next-line
import iconAction from '/img/action.svg';
// eslint-disable-next-line
import iconStatus from '/img/status.svg';

export default {
    components: {
        NavBar,
        FilterGroup,
        Map,
        Table,
        Quickview,
        simplebar,
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
            viewTypes: [
                { value: 'map', label: 'Carte' },
                { value: 'table', label: 'Tableau' },
            ],
            filters: [
                {
                    icon: iconType,
                    label: 'Types de site',
                    id: 'fieldType',
                    options: [],
                    opened: true,
                },
                {
                    icon: iconPeople,
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
                    icon: iconJustice,
                    label: 'Procédure judiciaire',
                    id: 'justice',
                    options: [
                        { value: 'no', label: 'Non', checked: true },
                        { value: 'yes', label: 'Oui', checked: true },
                    ],
                },
                {
                    icon: iconAction,
                    label: 'Actions en cours',
                    id: 'action',
                    options: [
                        { value: 'no', label: 'Non', checked: true },
                        { value: 'yes', label: 'Oui', checked: true },
                    ],
                },
                {
                    icon: iconStatus,
                    label: 'Statut des sites',
                    id: 'status',
                    options: [
                        { value: 'closed', label: 'Fermés', checked: false },
                        { value: 'opened', label: 'Ouverts', checked: true },
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
                styleClass: 'table',
                columns: [
                    {
                        label: 'Commune',
                        field: 'city.name',
                    },
                    {
                        label: 'Adresse',
                        field: 'address',
                    },
                    {
                        label: 'Type de site',
                        field: 'fieldType.label',
                    },
                    {
                        label: 'Personnes',
                        field: town => (town.populationTotal !== null ? town.populationTotal : 'inconnu'),
                    },
                    {
                        label: 'Ménages',
                        field: town => (town.populationCouples !== null ? town.populationCouples : 'inconnu'),
                    },
                    {
                        label: 'Mineurs',
                        field: town => (town.populationMinors !== null ? town.populationMinors : 'inconnu'),
                    },
                    {
                        label: 'Date d\'installation',
                        field: town => (town.builtAt ? new Date(town.builtAt * 1000).toLocaleString().substr(0, 10) : 'inconnu'),
                    },
                    {
                        label: 'Type de propriétaire',
                        field: 'ownerType.label',
                    },
                ],
                rows: this.visibleTowns,
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

                case 'status': {
                    const disallowedStatuses = filterGroup.options
                        .filter(option => !option.checked)
                        .map(option => option.value);

                    disallowedStatuses.forEach((value) => {
                        if (value === 'closed') {
                            visibleTowns = visibleTowns.filter(town => town.status === 'open');
                        } else if (value === 'opened') {
                            visibleTowns = visibleTowns.filter(town => town.status !== 'open');
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
    mounted() {
        window.addEventListener('resize', this.resize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resize);
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
        routeToTown(params) {
            this.$router.push(`/site/${params.row.id}`);
        },
        resize() {
            if (!this.$refs.main) {
                return;
            }

            this.stretchToBottom(this.$refs.main);
            this.stretchToBottom(this.$refs.filters.$el);
        },
        stretchToBottom(element) {
            const height = element.offsetHeight;
            const newHeight = height + (document.body.offsetHeight - (this.absoluteOffsetTop(element) + height));

            // eslint-disable-next-line
            element.style.height = `${newHeight}px`;
        },
        absoluteOffsetTop(element) {
            let top = 0;
            let el = element;

            do {
                top += el.offsetTop || 0;
                el = el.offsetParent;
            } while (el);

            return top;
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
                    this.$nextTick(() => {
                        this.resize();
                        this.$refs.map.resize();
                    });
                })
                .catch((errors) => {
                    this.error = errors.user_message;
                    this.loading = false;
                });
        },
    },
};
