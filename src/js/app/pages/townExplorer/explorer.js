import NavBar from '#app/layouts/navbar/navbar.vue';
import FilterGroup from './filterGroup/filterGroup.vue';
import Map from './map/map.vue';
import Address from '#app/components/address/address.vue';
import { VueGoodTable as Table } from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css';
import Quickview from '#app/components/quickview/quickview.vue';
import { all as fetchAll } from '#helpers/api/town';
import { get as getConfig, hasPermission } from '#helpers/api/config';
import simplebar from 'simplebar-vue';
import { autocompleteLocation } from '#helpers/addressHelper';
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
        Address,
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
                    permissions: [
                        { type: 'data', name: 'fieldType' },
                    ],
                    options: [],
                    opened: true,
                },
                {
                    icon: iconPeople,
                    label: 'Nombre de personnes',
                    id: 'population',
                    permissions: [
                        { type: 'data', name: 'populationTotal' },
                    ],
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
                    permissions: [
                        { type: 'data', name: 'ownerComplaint' },
                        { type: 'data', name: 'justiceProcedure' },
                        { type: 'data', name: 'justiceRendered' },
                    ],
                    options: [
                        { value: 'unknown', label: 'Inconnue', checked: true },
                        { value: 'none', label: 'Aucune', checked: true },
                        { value: 'ownerComplaint', label: 'Plainte déposée', checked: true },
                        { value: 'justiceProcedure', label: 'Procédure en cours', checked: true },
                        { value: 'justiceRendered', label: 'Décision rendue', checked: true },
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
                {
                    icon: iconStatus,
                    label: 'Type de propriétaire',
                    id: 'ownerType',
                    permissions: [
                        { type: 'data', name: 'ownerType' },
                    ],
                    options: getConfig().owner_types.map(type => ({
                        value: type.id,
                        label: type.label,
                        checked: true,
                    })),
                },
                {
                    icon: iconStatus,
                    label: 'Origines',
                    id: 'socialOrigin',
                    permissions: [
                        { type: 'data', name: 'socialOrigins' },
                    ],
                    options: [{
                        value: -1,
                        label: 'Inconnues',
                        checked: true,
                    }].concat(getConfig().social_origins.map(origin => ({
                        value: origin.id,
                        label: origin.label,
                        checked: true,
                    }))).concat([{
                        value: -2,
                        label: 'Mixtes',
                        checked: true,
                    }]),
                },
            ],
            location: null,
            currentTab: 'map',
            csvColumns: [
                {
                    label: 'statut du site',
                    field: 'status',
                },
                {
                    label: 'priorité',
                    field: 'priority',
                    permissions: [
                        { type: 'data', name: 'priority' },
                    ],
                },

                // location
                {
                    label: 'ville (code insee)',
                    field: 'cityCode',
                },
                {
                    label: 'ville',
                    field: 'cityName',
                },
                {
                    label: 'addresse',
                    field: 'address',
                    permissions: [
                        { type: 'data', name: 'address' },
                    ],
                },
                {
                    label: 'informations d\'accès',
                    field: 'addressDetails',
                    permissions: [
                        { type: 'data', name: 'addressDetails' },
                    ],
                },

                // caracteristics
                {
                    label: 'date d\'installation',
                    field: 'builtAt',
                    permissions: [
                        { type: 'data', name: 'builtAt' },
                    ],
                },
                {
                    label: 'date de signalement',
                    field: 'declaredAt',
                    permissions: [
                        { type: 'data', name: 'declaredAt' },
                    ],
                },
                {
                    label: 'date de fermeture',
                    field: 'closedAt',
                    permissions: [
                        { type: 'data', name: 'closedAt' },
                    ],
                },
                {
                    label: 'type de terrain',
                    field: 'fieldType',
                    permissions: [
                        { type: 'data', name: 'fieldType' },
                    ],
                },
                {
                    label: 'type de propriétaire',
                    field: 'ownerType',
                    permissions: [
                        { type: 'data', name: 'ownerType' },
                    ],
                },
                {
                    label: 'identité du propriétaire',
                    field: 'owner',
                    permissions: [
                        { type: 'data', name: 'owner' },
                    ],
                },

                // demography
                {
                    label: 'statut du diagnostic social',
                    field: 'censusStatus',
                    permissions: [
                        { type: 'data', name: 'censusStatus' },
                    ],
                },
                {
                    label: 'date du diagnostic',
                    field: 'censusConductedAt',
                    permissions: [
                        { type: 'data', name: 'censusConductedAt' },
                    ],
                },
                {
                    label: 'service en charge du diagnostic',
                    field: 'censusConductedBy',
                    permissions: [
                        { type: 'data', name: 'censusConductedBy' },
                    ],
                },
                {
                    label: 'nombre de personnes',
                    field: 'populationTotal',
                    permissions: [
                        { type: 'data', name: 'populationTotal' },
                    ],
                },
                {
                    label: 'nombre de ménages',
                    field: 'populationCouples',
                    permissions: [
                        { type: 'data', name: 'populationCouples' },
                    ],
                },
                {
                    label: 'nombre de mineurs',
                    field: 'populationMinors',
                    permissions: [
                        { type: 'data', name: 'populationMinors' },
                    ],
                },
                {
                    label: 'origines',
                    field: 'socialOrigins',
                    permissions: [
                        { type: 'data', name: 'socialOrigins' },
                    ],
                },

                // life conditions
                {
                    label: 'accès à l\'électricité',
                    field: 'accessToElectricity',
                    permissions: [
                        { type: 'data', name: 'accessToElectricity' },
                    ],
                },
                {
                    label: 'accès à l\'eau',
                    field: 'accessToWater',
                    permissions: [
                        { type: 'data', name: 'accessToWater' },
                    ],
                },
                {
                    label: 'évacuation des déchets',
                    field: 'trashEvacuation',
                    permissions: [
                        { type: 'data', name: 'trashEvacuation' },
                    ],
                },

                // justice
                {
                    label: 'dépôt de plainte par le propriétaire',
                    field: 'ownerComplaint',
                    permissions: [
                        { type: 'data', name: 'ownerComplaint' },
                    ],
                },
                {
                    label: 'existence d\'une procédure judiciaire',
                    field: 'justiceProcedure',
                    permissions: [
                        { type: 'data', name: 'justiceProcedure' },
                    ],
                },
                {
                    label: 'décision de justice rendue',
                    field: 'justiceRendered',
                    permissions: [
                        { type: 'data', name: 'justiceRendered' },
                    ],
                },
                {
                    label: 'date de la décision',
                    field: 'justiceRenderedAt',
                    permissions: [
                        { type: 'data', name: 'justiceRenderedAt' },
                    ],
                },
                {
                    label: 'origine de la décision',
                    field: 'justiceRenderedBy',
                    permissions: [
                        { type: 'data', name: 'justiceRenderedBy' },
                    ],
                },
                {
                    label: 'contentieux relatif à la décision de justice',
                    field: 'justiceChallenged',
                    permissions: [
                        { type: 'data', name: 'justiceChallenged' },
                    ],
                },

                // police
                {
                    label: 'concours de la force publique',
                    field: 'policeStatus',
                    permissions: [
                        { type: 'data', name: 'policeStatus' },
                    ],
                },
                {
                    label: 'date de la demande du CFP',
                    field: 'policeRequestedAt',
                    permissions: [
                        { type: 'data', name: 'policeRequestedAt' },
                    ],
                },
                {
                    label: 'date d\'octroi du CFP',
                    field: 'policeGrantedAt',
                    permissions: [
                        { type: 'data', name: 'policeGrantedAt' },
                    ],
                },
                {
                    label: 'étude d\'huissiers',
                    field: 'bailiff',
                    permissions: [
                        { type: 'data', name: 'bailiff' },
                    ],
                },

                // other
                {
                    label: 'mis à jour le',
                    field: 'updatedAt',
                    permissions: [
                        { type: 'data', name: 'updatedAt' },
                    ],
                },
            ],
        };
    },
    computed: {
        allowedFilters() {
            return this.filters.filter(filter => !filter.permissions || filter.permissions.every(permission => hasPermission(permission)));
        },
        allowedCsvColumns() {
            return this.csvColumns
                .filter(column => !column.permissions || column.permissions.every(permission => hasPermission(permission)));
        },
        rendererProps() {
            if (this.currentTab === 'map') {
                return {
                    towns: this.visibleTowns,
                    defaultView: this.defaultMapView,
                };
            }

            const columns = [
                {
                    label: 'Commune',
                    field: 'city.name',
                },
                {
                    label: 'Adresse',
                    field: 'address',
                    permissions: [
                        { type: 'data', name: 'address' },
                    ],
                },
                {
                    label: 'Type de site',
                    field: 'fieldType.label',
                    permissions: [
                        { type: 'data', name: 'fieldType' },
                    ],
                },
                {
                    label: 'Personnes',
                    field: town => (town.populationTotal !== null ? town.populationTotal : 'inconnu'),
                    type: 'number',
                    permissions: [
                        { type: 'data', name: 'populationTotal' },
                    ],
                },
                {
                    label: 'Ménages',
                    field: town => (town.populationCouples !== null ? town.populationCouples : 'inconnu'),
                    type: 'number',
                    permissions: [
                        { type: 'data', name: 'populationCouples' },
                    ],
                },
                {
                    label: 'Mineurs',
                    field: town => (town.populationMinors !== null ? town.populationMinors : 'inconnu'),
                    type: 'number',
                    permissions: [
                        { type: 'data', name: 'populationMinors' },
                    ],
                },
                {
                    label: 'Date d\'installation',
                    field: town => (town.builtAt ? App.formatDate(town.builtAt) : 'inconnu'),
                    type: 'text',
                    permissions: [
                        { type: 'data', name: 'builtAt' },
                    ],
                },
                {
                    label: 'Type de propriétaire',
                    field: 'ownerType.label',
                    permissions: [
                        { type: 'data', name: 'ownerType' },
                    ],
                },
            ];

            return {
                styleClass: 'table',
                columns: columns.filter(column => !column.permissions || column.permissions.every(permission => hasPermission(permission))),
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

            // location filters
            if (this.location !== null) {
                visibleTowns = visibleTowns.filter((town) => {
                    switch (this.location.type) {
                    case 'Commune':
                        return town.city.code === this.location.code;

                    case 'EPCI':
                        return town.epci.code === this.location.code;

                    case 'Département':
                        return town.departement.code === this.location.code;

                    default:
                        return false;
                    }
                });
            }

            // regular filters
            this.allowedFilters.forEach((filterGroup) => {
                switch (filterGroup.id) {
                case 'fieldType': {
                    const allowedFieldTypes = filterGroup.options
                        .filter(option => option.checked)
                        .map(option => option.value);

                    visibleTowns = visibleTowns.filter(town => town.fieldType && allowedFieldTypes.indexOf(town.fieldType.id) !== -1);
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
                        switch (value) {
                        case 'unknown':
                            visibleTowns = visibleTowns.filter(town => town.ownerComplaint !== null);
                            break;

                        case 'none':
                            visibleTowns = visibleTowns.filter(town => town.ownerComplaint !== false);
                            break;

                        case 'ownerComplaint':
                            visibleTowns = visibleTowns.filter(town => town.ownerComplaint !== true || town.justiceProcedure === true);
                            break;

                        case 'justiceProcedure':
                            visibleTowns = visibleTowns.filter(town => town.justiceProcedure !== true || town.justiceRendered === true);
                            break;

                        case 'justiceRendered':
                            visibleTowns = visibleTowns.filter(town => town.justiceRendered !== true);
                            break;

                        default:
                            break;
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

                case 'ownerType': {
                    const allowedOwnerTypes = filterGroup.options
                        .filter(option => option.checked)
                        .map(option => option.value);

                    visibleTowns = visibleTowns.filter(town => town.ownerType && allowedOwnerTypes.indexOf(town.ownerType.id) !== -1);
                }
                    break;

                case 'socialOrigin': {
                    const disallowedOrigins = filterGroup.options
                        .filter(option => !option.checked)
                        .map(option => option.value);

                    disallowedOrigins.forEach((origin) => {
                        if (origin === -1) {
                            visibleTowns = visibleTowns.filter(town => town.socialOrigins.length > 0);
                        } else if (origin === -2) {
                            visibleTowns = visibleTowns.filter(town => town.socialOrigins.length <= 1);
                        } else {
                            visibleTowns = visibleTowns.filter(town => town.socialOrigins.length !== 1 || !town.socialOrigins.some(o => o.id === origin));
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
        autocompleteLocation,
        exportData() {
            const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${this.allowedCsvColumns.map(column => column.label).join(',')}\n${this.visibleTowns.map(this.townToCsv).join('\n')}`);
            this.$refs.export.setAttribute('href', encodedUri);
            this.$refs.export.setAttribute('download', `export_bidonvilles_${App.formatDate(Date.now() / 1000, 'y_m_d')}.csv`);
            this.$refs.export.click();
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

            return this.allowedCsvColumns
                .map(({ field }) => {
                    switch (field) {
                    case 'status':
                        return convertStatus[town.status];
                    case 'priority':
                        return town.priority;
                    case 'cityCode':
                        return town.city.code;
                    case 'cityName':
                        return town.city.name;
                    case 'address':
                        return town.address || '';
                    case 'addressDetails':
                        return town.addressDetails || '';
                    case 'builtAt':
                        return town.builtAt ? App.formatDate(town.builtAt) : '';
                    case 'declaredAt':
                        return town.declaredAt ? App.formatDate(town.declaredAt) : '';
                    case 'closedAt':
                        return town.closedAt ? App.formatDate(town.closedAt) : '';
                    case 'fieldType':
                        return town.fieldType ? town.fieldType.label : '';
                    case 'ownerType':
                        return town.ownerType ? town.ownerType.label : '';
                    case 'owner':
                        return town.owner || '';
                    case 'censusStatus':
                        return convertCensusStatus[town.censusStatus];
                    case 'censusConductedAt':
                        return town.censusConductedAt ? App.formatDate(town.censusConductedAt) : '';
                    case 'censusConductedBy':
                        return town.censusConductedBy || '';
                    case 'populationTotal':
                        return town.populationTotal || '';
                    case 'populationCouples':
                        return town.populationCouples || '';
                    case 'populationMinors':
                        return town.populationMinors || '';
                    case 'socialOrigins':
                        return town.socialOrigins.map(origin => origin.label).join(';') || '';
                    case 'accessToElectricity':
                        return convertBool[town.accessToElectricity];
                    case 'accessToWater':
                        return convertBool[town.accessToWater];
                    case 'trashEvacuation':
                        return convertBool[town.trashEvacuation];
                    case 'ownerComplaint':
                        return convertBool[town.ownerComplaint];
                    case 'justiceProcedure':
                        return convertBool[town.justiceProcedure];
                    case 'justiceRendered':
                        return convertBool[town.justiceRendered];
                    case 'justiceRenderedAt':
                        return town.justiceRenderedAt ? App.formatDate(town.justiceRenderedAt) : '';
                    case 'justiceRenderedBy':
                        return town.justiceRenderedBy || '';
                    case 'justiceChallenged':
                        return convertBool[town.justiceChallenged];
                    case 'policeStatus':
                        return convertPoliceStatus[town.policeStatus];
                    case 'policeRequestedAt':
                        return town.policeRequestedAt ? App.formatDate(town.policeRequestedAt) : '';
                    case 'policeGrantedAt':
                        return town.policeGrantedAt ? App.formatDate(town.policeGrantedAt) : '';
                    case 'bailiff':
                        return town.bailiff || '';
                    case 'updatedAt':
                        return town.updatedAt ? App.formatDate(town.updatedAt) : '';
                    default:
                        return '';
                    }
                })
                .map(value => (value && value.replace ? `"${value.replace(/"/g, '""')}"` : value)).join(',');
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
            const routeData = this.$router.resolve(`/site/${params.row.id}`);
            window.open(routeData.href, '_blank');
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
