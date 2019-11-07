import TableFilter from '#app/components/tableFilter/tableFilter.vue';

export default {
    components: {
        TableFilter,
    },

    props: {
        columns: {
            type: Array,
            required: true,
        },
        content: {
            type: Array,
            required: false,
            default() {
                return [];
            },
        },
        emptyLabel: {
            type: String,
            required: false,
            default: 'Aucune donnée disponible pour les filtres sélectionnés',
        },
    },

    data() {
        return {
            currentFilter: null,
            filters: this.columns.reduce((acc, column) => {
                if (column.filters === undefined) {
                    return acc;
                }

                return Object.assign({}, acc, {
                    [column.id]: column.filters.map((filter) => {
                        if (filter.checked !== undefined) {
                            return filter;
                        }

                        return Object.assign({}, filter, { checked: false });
                    }),
                });
            }, {}),
        };
    },

    computed: {
        computedColumns() {
            return this.columns.map(column => Object.assign({}, column, {
                isFilterable: column.filters !== undefined,
            }));
        },
        checkedFilters() {
            return Object.keys(this.filters).reduce((acc, columnId) => Object.assign({}, acc, {
                [columnId]: this.filters[columnId].filter(({ checked }) => checked === true).length,
            }), {});
        },
    },

    methods: {
        toggleFilter(columnId) {
            if (this.currentFilter === columnId) {
                this.currentFilter = null;
            } else {
                this.currentFilter = columnId;
            }
        },

        hideFilter() {
            this.currentFilter = null;
        },

        click(event, row) {
            this.$emit('click', row, event);
        },
    },
};
