import TableFilter from "#app/components/tableFilter/tableFilter.vue";

/**
 * Default umber of items per page
 *
 * @const {Number}
 */
const DEFAULT_ITEMS_PER_PAGE = 10;

export default {
    components: {
        TableFilter
    },

    props: {
        /**
         * The list of columns
         *
         * @type {Array.<TableColumn>}
         */
        columns: {
            type: Array,
            required: true
        },

        /**
         * The unfiltered content of the table
         *
         * @type {Array.<Object>} The object obviously depends on the list of columns
         */
        content: {
            type: Array,
            required: false,
            default() {
                return [];
            }
        },

        /**
         * The message to be shown whenever the table is empty
         *
         * @type {String}
         */
        emptyLabel: {
            type: String,
            required: false,
            default: "Aucune donnée disponible pour les filtres sélectionnés"
        },

        /**
         * Number of items per page
         *
         * @type {Number}
         */
        itemsPerPage: {
            type: Number,
            required: false,
            default: DEFAULT_ITEMS_PER_PAGE
        }
    },

    data() {
        return {
            /**
             * Map of filters for each column
             *
             * @type {Object.<string,Array.<TableFilterItem>>}
             */
            parsedFilters: this.parseFilters(),

            /**
             * Column id for the currently visible filter
             *
             * @type {String|null}
             */
            currentFilter: null,

            /**
             * Index of the current page, starting from 0
             *
             * @type {Number}
             */
            currentPage: 0
        };
    },

    computed: {
        /**
         * Parses the list of columns and enriches it with automatically computed properties
         *
         * @returns {Array.<TableColumn>}
         */
        parsedColumns() {
            return this.columns.map(column => ({
                ...column,
                isFilterable: column.filters !== undefined
            }));
        },

        /**
         * Returns the list of checked filter items for each column
         *
         * Please note that even columns with no defined filters appear in the result: they are
         * always matched with an empty array.
         *
         * @returns {Object.<String,Array.<TableFilterItem>>}
         */
        checkedFilters() {
            return Object.keys(this.parsedFilters).reduce(
                (acc, columnId) => ({
                    ...acc,
                    [columnId]: this.parsedFilters[columnId].filter(
                        ({ checked }) => checked === true
                    )
                }),
                {}
            );
        },

        /**
         * Filters the content
         *
         * @returns {Array.<Object>}
         */
        filteredContent() {
            // every time the content of the table changes, reset the pagination
            this.currentPage = 0;

            // eslint-disable-next-line arrow-body-style
            return this.content.filter(row => {
                // keep the row only if the filters are matched for each column
                return this.columns.every(({ id: columnId, filterFn }) => {
                    if (this.checkedFilters[columnId].length === 0) {
                        return true;
                    }

                    return filterFn(row, this.checkedFilters[columnId]);
                });
            });
        },

        /**
         * Current page content
         *
         * @returns {Array.<Object>}
         */
        currentPageContent() {
            return this.filteredContent.slice(
                this.currentPage * this.itemsPerPage,
                this.currentPage * this.itemsPerPage + this.itemsPerPage
            );
        },

        /**
         * Index of the last available page, starting from 0
         *
         * @returns {Number}
         */
        indexOfLastPage() {
            return Math.max(
                0,
                Math.ceil(this.filteredContent.length / this.itemsPerPage) - 1
            );
        },

        /**
         * Index of the first row displayed in current page, starting from 1
         *
         * @returns {Number}
         */
        indexOfFirstRowInCurrentPage() {
            return this.filteredContent.length > 0
                ? this.currentPage * this.itemsPerPage + 1
                : 0;
        },

        /**
         * Index of the last row displayed in current page, starting from 1
         *
         * @returns {Number}
         */
        indexOfLastRowInCurrentPage() {
            return Math.min(
                this.indexOfFirstRowInCurrentPage + this.itemsPerPage - 1,
                this.filteredContent.length
            );
        }
    },

    watch: {
        /**
         * Every time the list of columns of the table changes:
         *
         * - reset the pagination
         * - reset the filters
         */
        columns() {
            this.parsedFilters = this.parseFilters();
            this.currentPage = 0;
        },

        /**
         * Every time the content of the table changes:
         *
         * - reset the pagination
         * - reset the filters
         */
        content() {
            this.parsedFilters = this.parseFilters();
            this.currentFilter = null;
            this.currentPage = 0;
        }
    },

    methods: {
        /**
         * Propagates any click on a row
         *
         * @param {ClickEvent} event
         * @param {Object}     row
         *
         * @returns {undefined}
         */
        click(event, row) {
            this.$emit("click", row, event);
        },

        /**
         * Creates a map, matching a list of filter items for each column id
         *
         * Please note that columns with no defined filters will be in the map, matched with an
         * empty array.
         *
         * @returns {Object.<String,Array.<TableFilterItem>>}
         */
        parseFilters() {
            return this.columns.reduce((acc, column) => {
                // columns with no filters get an empty array
                if (column.filters === undefined) {
                    return { ...acc, [column.id]: [] };
                }

                // parse every filter item of this column (basically, initialize the value of `checked`)
                return {
                    ...acc,
                    [column.id]: column.filters.map(filter => {
                        if (filter.checked !== undefined) {
                            return filter;
                        }

                        return { ...filter, checked: false };
                    })
                };
            }, {});
        },

        /**
         * Toggles the filter of a specific column
         *
         * @param {String} columnId
         *
         * @returns {undefined}
         */
        toggleFilter(columnId) {
            if (this.currentFilter === columnId) {
                this.currentFilter = null;
            } else {
                this.currentFilter = columnId;
            }
        },

        /**
         * Hides the currently visible filter
         *
         * @returns {undefined}
         */
        hideFilter() {
            this.currentFilter = null;
        },

        /**
         * Moves to previous page
         *
         * @returns {undefined}
         */
        previousPage() {
            this.currentPage = Math.max(0, this.currentPage - 1);
        },

        /**
         * Moves to next page
         *
         * @returns {undefined}
         */
        nextPage() {
            this.currentPage = Math.min(
                this.indexOfLastPage,
                this.currentPage + 1
            );
        }
    }
};

/**
 * @typedef {Object} TableFilterItem
 * @property {String}  label
 * @property {Object}  value
 * @property {Boolean} [checked=false] If not defined, it is automatically set to `false`
 */

/**
 * @callback TableFilterFunction
 *
 * This function checks whether the given row should be visible, based on the given checked
 * filter items.
 *
 * @param {Object}                  row          Any row from `content`
 * @param {Array.<TableFilterItem>} checkedItems The list of checked items
 *
 * @returns {Boolean} True if the row should be visible, false otherwise
 */

/**
 * @typedef {Object} TableColumn
 * @property {String}                  id
 * @property {String}                  label
 * @property {Array.<TableFilterItem>} [filters]      Mandatory if `filterFn` is provided
 * @property {TableFilterFunction}     [filterFn]     Mandatory if `filters` is provided
 * @property {Boolean}                 [isFilterable] This property is automatically computed
 *                                                    based on the definition of `filters`
 */
