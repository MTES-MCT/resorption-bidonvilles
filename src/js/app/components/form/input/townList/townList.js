import { VueGoodTable } from 'vue-good-table';
import { hasPermission } from '#helpers/api/config';
import { all as fetchAll } from '#helpers/api/town';

export default {
    components: {
        VueGoodTable,
    },

    props: {
        /**
         * @type {Array.<Number>}
         */
        value: {
            type: Array,
            required: false,
            default() {
                return [];
            },
        },

        /**
         * Whether the input should be disabled or not
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },

        /**
         * A function that takes a town as input, and returns a boolean
         *
         * @type {Function}
         */
        filter: {
            type: Function,
            required: false,
            default: null,
        },
    },

    data() {
        const columns = [
            {
                label: 'Statut du site',
                field: 'status',
                formatFn: value => (value === 'open' ? 'Existant' : 'Disparu'),
            },
            {
                label: 'Commune',
                field: 'city.name',
            },
            {
                label: 'Adresse',
                field: 'address',
            },
        ];

        return {
            /**
             * Data loading status
             *
             * @type {String|null} Either 'loading', 'loaded', 'error'
             */
            status: null,

            /**
             * Data loading error message
             *
             * @type {String|null}
             */
            loadingError: null,

            /**
             * List of towns
             *
             * @type {Array.<Object>}
             */
            towns: [],

            /**
             * Ids of selected towns
             *
             * @type {Array.<Shantytown>}
             */
            selectedTowns: this.value,

            /**
             * Last detected search term
             *
             * @type {String}
             */
            lastSearch: '',

            /**
             * Wheter the latest change in selection has been handled by onSelectionChange
             *
             * Please see onSelectAll() for more details about the usage of this
             * property.
             *
             * @type {Boolean}
             */
            changeIsHandled: false,

            /**
             * Table properties
             *
             * Please see VueGoodTable's documentation for more details.
             *
             * @type {Object}
             */
            tableProps: {
                styleClass: 'table',
                columns: columns.filter(column => !column.permissions || column.permissions.every(permission => hasPermission(permission))),
                rows: [],
                'sort-options': {
                    enabled: true,
                    initialSortBy: {
                        field: 'status',
                        type: 'asc',
                    },
                },
                'pagination-options': {
                    enabled: true,
                    perPage: 10,
                    perPageDropdown: [5, 10, 20, 30, 40, 50],
                    nextLabel: 'Suivant',
                    prevLabel: 'Précédent',
                    rowsPerPageLabel: 'Nombre de sites par page',
                    ofLabel: 'sur',
                    pageLabel: 'Page', // for 'pages' mode
                    allLabel: 'Tous',
                },
                'select-options': {
                    enabled: true,
                    selectionInfoClass: 'selectionInfo',
                    selectionText: 'sites sélectionnés',
                    clearSelectionText: 'annuler',
                },
                'search-options': {
                    enabled: true,
                    placeholder: 'Taper ici le début d\'une adresse ou du nom d\'une commune',
                },
                'row-style-class': row => (row.status === 'open' ? 'open' : 'closed'),
            },
        };
    },


    watch: {
        // two-way binding
        value() {
            this.selectedTowns = this.value;
        },

        selectedTowns() {
            this.tableProps.rows = this.filteredTowns();
            this.$emit('input', this.selectedTowns);
        },

        /**
         * Handles a change in the filter method
         *
         * @returns {undefined}
         */
        filter() {
            this.selectedTowns = [];
        },

        /**
         * Handles a change of 'disabled'
         *
         * @returns {undefined}
         */
        disabled() {
            this.tableProps['select-options'].enabled = !this.disabled;
            this.tableProps['search-options'].enabled = !this.disabled;
        },
    },


    mounted() {
        // on mount, try to load the list of shantytowns
        this.load();
    },


    methods: {
        /**
         * Handles a new search
         *
         * @returns {undefined}
         */
        onSearch() {
            this.$nextTick(() => {
                this.lastSearch = this.$refs.table.globalSearchTerm;
            });
        },

        /**
         * Handles a click on the '(un)select all' checkbox of the table
         *
         * In most cases, the selection change caused by the click on the '(un)select all' checkbox
         * also triggers a 'selectionChange' event, handled by the method onSelectionChange().
         * But there are a few cases for which this is not true.
         *
         * This method detects thoses cases, and updates the table accordingly.
         *
         * @param {Object} params Please see VueGoodTable's documentation
         *
         * @returns {undefined}
         */
        onSelectAll({ selected }) {
            if (selected) {
                return;
            }

            // The idea here is to detect if onSelectionChange() will be called too or not
            // and if not, update the table.
            // To do so, we set "changeIsHandled" to false and wait a little time (hence the nextTick).
            // If after that time, "changeIsHandled" is still set to false, then onSelectionChange()
            // has not be called (and will not) and we can proceed with our business
            this.changeIsHandled = false;

            this.$nextTick(() => {
                this.lastSearch = this.$refs.table.globalSearchTerm;

                if (this.changeIsHandled === false) {
                    this.tableProps.rows = this.filteredTowns(); // necessary to keep selected rows checked
                }
            });
        },

        /**
         * Handles a change in the list of selected towns
         *
         * @param {Object} params Please see VueGoodTable's documentation
         *
         * @returns {undefined}
         */
        onSelectionChange({ selectedRows: rows }) {
            // mark the event as handled
            this.changeIsHandled = true;

            // ensure this change has not been triggered by a new search query
            if (this.$refs.table.globalSearchTerm !== this.lastSearch) {
                this.lastSearch = this.$refs.table.globalSearchTerm;
                this.tableProps.rows = this.filteredTowns(); // necessary to keep selected rows checked
                return;
            }

            // parse the list of selected rows and compute which towns should be added/removed to/from selection
            const { toBeAdded, toBeRemoved } = this.$refs.table.processedRows[0].children
                .reduce((acc, shantytown) => {
                    if (rows.some(({ id: selectedId }) => selectedId === shantytown.id)) {
                        acc.toBeAdded.push(shantytown);
                    } else {
                        acc.toBeRemoved.push(shantytown);
                    }

                    return acc;
                }, {
                    toBeAdded: [],
                    toBeRemoved: [],
                });

            // update the selection
            this.selectedTowns = this.removeFromSelection(
                this.addToSelection(this.selectedTowns, toBeAdded),
                toBeRemoved,
            );
        },

        /**
         * Merges the two given list of town ids without duplicates
         *
         * @param {Array.<Shantytown>} selection Original selection
         * @param {Array.<Shantytown>} toBeAdded Ids to be added to the original selection
         *
         * @returns {Array.<Shantytown>}
         */
        addToSelection(selection, toBeAdded) {
            return [
                ...selection.filter(({ id }) => !toBeAdded.some(({ id: toBeAddedId }) => id === toBeAddedId)),
                ...toBeAdded,
            ];
        },

        /**
         * Removes a list of ids from the given selection
         *
         * @param {Array.<Shantytown>} selection   Original selection
         * @param {Array.<Shantytown>} toBeRemoved Ids to be removed from the original selection
         *
         * @returns {Array.<Shantytown>}
         */
        removeFromSelection(selection, toBeRemoved) {
            return selection.filter(({ id }) => !toBeRemoved.some(({ id: toBeRemovedId }) => id === toBeRemovedId));
        },

        /**
         * Loads shantytowns
         *
         * @returns {undefined}
         */
        load() {
            if (this.status === 'loaded' || this.status === 'loading') {
                return;
            }

            this.status = 'loading';
            this.loadingError = null;

            fetchAll()
                .then((data) => {
                    this.status = 'loaded';
                    this.towns = data;
                    this.tableProps.rows = this.filteredTowns();
                })
                .catch(({ user_message: error }) => {
                    this.status = 'error';
                    this.loadingError = error;
                });
        },

        /**
         * Returns the properly filtered list of towns
         *
         * Please note that the "selection" state of each town is also set.
         *
         * @returns {Array.<Object>}
         */
        filteredTowns() {
            return (this.filter !== null ? this.towns.filter(this.filter) : this.towns).map(town => Object.assign({}, town, {
                vgtSelected: this.selectedTowns.some(({ id }) => id === town.id) === true,
            }));
        },
    },
};
