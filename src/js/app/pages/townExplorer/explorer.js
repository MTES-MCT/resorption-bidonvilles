import NavBar from '#app/layouts/navbar/navbar.vue';
import FilterGroup from './filterGroup/filterGroup.vue';
import Map from './map/map.vue';
import { VueGoodTable as Table } from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css';
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
                        { value: 'closed', label: 'Disparus', checked: false },
                        { value: 'opened', label: 'Existants', checked: true },
                    ],
                },
            ],
            currentTab: 'map',
            csvHeader: [
                'statut du site',
                'priorité',

                // location
                'ville (code insee)',
                'ville',
                'addresse',
                'informations d\'accès',

                // caracteristics
                'date d\'installation',
                'date de signalement',
                'date de fermeture',
                'type de terrain',
                'type de propriétaire',
                'identité du propriétaire',

                // demography
                'statut du diagnostic social',
                'date du diagnostic',
                'service en charge du diagnostic',
                'nombre de personnes',
                'nombre de ménages',
                'nombre de mineurs',
                'origines',

                // life conditions
                'accès à l\'électricité',
                'accès à l\'eau',
                'évacuation des déchets',

                // justice
                'dépôt de plainte par le propriétaire',
                'existence d\'une procédure judiciaire',
                'décision de justice rendue',
                'date de la décision',
                'origine de la décision',
                'contentieux relatif à la décision de justice',

                // police
                'concours de la force publique',
                'date de la demande du CFP',
                'date d\'octroi du CFP',
                'étude d\'huissiers',

                // other
                'mis à jour le',
            ].join(','),
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
                        filterOptions: {
                            enabled: true,
                            placeholder: 'Filtrer par commune',
                        },
                    },
                    {
                        label: 'Adresse',
                        field: 'address',
                        filterOptions: {
                            enabled: true,
                            placeholder: 'Filtrer par adresse',
                        },
                    },
                    {
                        label: 'Type de site',
                        field: 'fieldType.label',
                    },
                    {
                        label: 'Personnes',
                        field: town => (town.populationTotal !== null ? town.populationTotal : 'inconnu'),
                        type: 'number',
                    },
                    {
                        label: 'Ménages',
                        field: town => (town.populationCouples !== null ? town.populationCouples : 'inconnu'),
                        type: 'number',
                    },
                    {
                        label: 'Mineurs',
                        field: town => (town.populationMinors !== null ? town.populationMinors : 'inconnu'),
                        type: 'number',
                    },
                    {
                        label: 'Date d\'installation',
                        field: town => (town.builtAt ? App.formatDate(town.builtAt) : 'inconnu'),
                        type: 'text',
                    },
                    {
                        label: 'Type de propriétaire',
                        field: 'ownerType.label',
                    },
                ],
                rows: this.visibleTowns,
                'sort-options': {
                    enabled: true,
                },
                'pagination-options': {
                    enabled: true,
                    perPage: 20,
                    perPageDropdown: [5, 10, 20, 30, 40, 50],
                    nextLabel: 'Suivant',
                    prevLabel: 'Précédent',
                    rowsPerPageLabel: 'Nombre de sites par page',
                    ofLabel: 'sur',
                    pageLabel: 'Page', // for 'pages' mode
                    allLabel: 'Tous',
                },
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
                            visibleTowns = visibleTowns.filter(town => town.justiceProcedure !== true);
                        } else if (value === 'no') {
                            visibleTowns = visibleTowns.filter(town => town.justiceProcedure === true);
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
        exportData() {
            const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${this.csvHeader}\n${this.visibleTowns.map(this.townToCsv).join('\n')}`);
            window.open(encodedUri);
        },
        townToCsv(town) {
            const convertBool = {
                null: '',
                true: 'oui',
                false: 'non',
            };
            const convertCensusStatus = {
                null: '',
                none: 'Non prévu',
                scheduled: 'Prévu',
                done: 'Réalisé',
            };
            const convertPoliceStatus = {
                null: 'Inconnu',
                none: 'Non demandé',
                requested: 'Demandé',
                granted: 'Obtenu',
            };
            const convertStatus = {
                open: 'ouvert',
                other: 'fermé (autre raison)',
                closed_by_justice: 'fermé (décision de justice)',
                closed_by_admin: 'fermé (décision administrative)',
                unknown: 'fermé (cause inconnue)',
            };

            return [
                convertStatus[town.status],
                town.priority,

                // location
                town.city.code,
                town.city.name,
                town.address || '',
                town.addressDetails || '',

                // caracteristics
                town.builtAt ? App.formatDate(town.builtAt) : '',
                town.declaredAt ? App.formatDate(town.declaredAt) : '',
                town.closedAt ? App.formatDate(town.closedAt) : '',
                town.fieldType ? town.fieldType.label : '',
                town.ownerType ? town.ownerType.label : '',
                town.owner || '',

                // demography
                convertCensusStatus[town.censusStatus],
                town.censusConductedAt ? App.formatDate(town.censusConductedAt) : '',
                town.censusConductedBy || '',
                town.populationTotal || '',
                town.populationCouples || '',
                town.populationMinors || '',
                town.socialOrigins.map(origin => origin.label).join(';') || '',

                // life conditions
                convertBool[town.accessToElectricity],
                convertBool[town.accessToWater],
                convertBool[town.trashEvacuation],

                // justice
                convertBool[town.ownerComplaint],
                convertBool[town.justiceProcedure],
                convertBool[town.justiceRendered],
                town.justiceRenderedAt ? App.formatDate(town.justiceRenderedAt) : '',
                town.justiceRenderedBy || '',
                convertBool[town.justiceChallenged],

                // police
                convertPoliceStatus[town.policeStatus],
                town.policeRequestedAt ? App.formatDate(town.policeRequestedAt) : '',
                town.policeGrantedAt ? App.formatDate(town.policeGrantedAt) : '',
                town.bailiff || '',

                // other
                town.updatedAt ? App.formatDate(town.updatedAt) : '',
            ].map(value => (value && value.replace ? `"${value.replace(/"/g, '""')}"` : value)).join(',');
        },
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
