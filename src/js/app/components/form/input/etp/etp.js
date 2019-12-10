import { get as getConfig } from '#helpers/api/config';

export default {

    props: {
        /**
         * Value
         *
         * @type {Array.<EtpRow>}
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
    },


    data() {
        const { etp_types: types } = getConfig();

        return {
            rows: this.value,
            types,
        };
    },


    computed: {
        parsedRows() {
            return this.rows.map(row => ({
                type: row.type ? row.type : null,
                total: parseFloat(row.total),
            }));
        },
    },


    watch: {
        parsedRows() {
            this.emitInput();
        },
    },


    methods: {
        /**
         *
         */
        addRow() {
            if (this.disabled) {
                return;
            }

            this.rows.push({
                type: undefined,
                total: 0,
            });
            this.emitInput();
        },

        /**
         *
         */
        removeRow(i) {
            if (this.disabled) {
                return;
            }

            if (i >= this.rows.length) {
                return;
            }

            this.rows.splice(i, 1);
            this.emitInput();
        },

        /**
         * Emits input for data binding
         *
         * @returns {undefined}
         */
        emitInput() {
            this.$emit('input', this.parsedRows);
        },
    },

};
