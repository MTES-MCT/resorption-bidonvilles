import NavBar from '#app/layouts/navbar/navbar.vue';
import FilterGroup from './filterGroup/filterGroup.vue';
import Map from './map/map.vue';
import Address from '#app/components/address/address.vue';
import { VueGoodTable as Table } from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css';
import Quickview from '#app/components/quickview/quickview.vue';
import Export from '#app/components/export/export.vue';
import { all as fetchAll } from '#helpers/api/town';
import { get as getConfig, getPermission } from '#helpers/api/config';
import simplebar from 'simplebar-vue';
import { autocompleteLocation } from '#helpers/addressHelper';
import { open } from '#helpers/tabHelper';

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

// eslint-disable-next-line
import iconFormat from '/img/format.svg';
// eslint-disable-next-line
import iconGeo from '/img/geo.svg';
// eslint-disable-next-line
import iconOrigins from '/img/origins.svg';

/**
 * Returns the appropriate zoom level for the given location type
 *
 * @param {String} locationType
 *
 * @returns {Number}
 */
function getDefaultZoomFor(locationType) {
    switch (locationType) {
    case 'nation':
    case 'region':
        return 6;

    default:
    case 'departement':
    case 'epci':
    case 'city':
        return 10;
    }
}

export default {
    components: {
        NavBar,
        FilterGroup,
        Map,
        Table,
        Quickview,
        simplebar,
        Address,
        Export,
    },
    data() {
        const { user } = getConfig();

        return {
            error: undefined,
            loading: false,
            defaultMapView: {
                center: [user.organization.location.latitude, user.organization.location.longitude],
                zoom: getDefaultZoomFor(user.organization.location.type),
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
            permission: getPermission('shantytown.list'),
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
                    permissions: ['data_justice'],
                    options: [
                        { value: 'unknown', label: 'Inconnue', checked: true },
                        { value: 'none', label: 'Aucune', checked: true },
                        { value: 'ownerComplaint', label: 'Plainte déposée', checked: true },
                        { value: 'justiceProcedure', label: 'Procédure en cours', checked: true },
                        { value: 'justiceRendered', label: 'Décision rendue', checked: true },
                    ],
                },
                {
                    icon: iconJustice,
                    label: 'Concours de Force Publique',
                    id: 'police',
                    permissions: ['data_justice'],
                    options: [
                        { value: null, label: 'Inconnu', checked: true },
                        { value: 'none', label: 'Non demandé', checked: true },
                        { value: 'requested', label: 'Demandé', checked: true },
                        { value: 'granted', label: 'Obtenu', checked: true },
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
                    icon: iconPeople,
                    label: 'Type de propriétaire',
                    id: 'ownerType',
                    options: getConfig().owner_types.map(type => ({
                        value: type.id,
                        label: type.label,
                        checked: true,
                    })),
                },
                {
                    icon: iconOrigins,
                    label: 'Origines',
                    id: 'socialOrigin',
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
            iconFormat,
            iconGeo,
            location: user.organization.location.type !== 'nation' ? {
                locationType: user.organization.location.type,
                code: user.organization.location[user.organization.location.type].code,
                label: user.organization.location[user.organization.location.type].name,
            } : null,
            currentTab: 'map',
            exporter: {
                isVisible: false,
            },
        };
    },
    computed: {
        allowedFilters() {
            if (!this.permission) {
                return [];
            }

            return this.filters.filter(
                filter => !filter.permissions || filter.permissions.every(permission => this.permission[permission]),
            );
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
                    label: 'Département',
                    field: ({ departement: { name, code } }) => `${code} - ${name}`,
                },
                {
                    label: 'Commune',
                    field: 'city.name',
                },
                {
                    label: 'Adresse',
                    field: 'addressSimple',
                },
                {
                    label: 'Type de site',
                    field: 'fieldType.label',
                },
                {
                    label: 'Personnes',
                    field: town => (town.populationTotal !== null ? town.populationTotal : 'inconnu'),
                    sortFn: this.sortNumber,
                    type: 'number',
                },
                {
                    label: 'Ménages',
                    field: town => (town.populationCouples !== null ? town.populationCouples : 'inconnu'),
                    sortFn: this.sortNumber,
                    type: 'number',
                },
                {
                    label: 'Mineurs',
                    field: town => (town.populationMinors !== null ? town.populationMinors : 'inconnu'),
                    sortFn: this.sortNumber,
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
            ];

            return {
                styleClass: 'table',
                columns,
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
                    switch (this.location.locationType) {
                    case 'city':
                        return town.city.code === this.location.code || town.city.main === this.location.code;

                    case 'epci':
                        return town.epci.code === this.location.code;

                    case 'departement':
                        return town.departement.code === this.location.code;

                    case 'region':
                        return town.region.code === this.location.code;

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

                case 'police': {
                    const disallowedPolice = filterGroup.options
                        .filter(option => !option.checked)
                        .map(option => option.value);

                    if (disallowedPolice.length > 0) {
                        visibleTowns = visibleTowns.filter(town => disallowedPolice.indexOf(town.policeStatus) === -1);
                    }
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
        sortNumber(x, y) {
            if (x === 'inconnu' && y === 'inconnu') {
                return 0;
            }

            if (x === 'inconnu') {
                return -1;
            }

            if (y === 'inconnu') {
                return 1;
            }

            if (x < y) {
                return -1;
            }

            if (x > y) {
                return 1;
            }

            return 0;
        },
        showExport() {
            setTimeout(() => {
                this.exporter.isVisible = true;
            }, 100);
        },
        hideExport() {
            this.exporter.isVisible = false;
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
            open(routeData.href);
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
