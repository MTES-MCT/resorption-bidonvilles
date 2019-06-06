import PlanFundingRow from './planFundingRow/planFundingRow.vue';

export default {

    components: {
        PlanFundingRow,
    },

    props: {
        /**
         * @type {Array.<PlanFunding>}
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
        return {
            /**
             * Funding rows
             *
             * @type {Array.<PlanFunding>}
             */
            fundings: this.value.map(data => ({ data })),
        };
    },


    watch: {
        // two-way binding
        value() {
            this.fundings = this.value.map(data => ({ data }));
        },
    },


    methods: {
        /**
         * Adds a funding row
         *
         * @returns {undefined}
         */
        addRow() {
            if (this.disabled) {
                return;
            }

            this.fundings.push({
                data: {
                    type: null,
                    amount: 0.0,
                    details: '',
                },
            });
            this.emitInput();
        },

        /**
         * Removes a funding row
         *
         * @param {Number} index
         *
         * @returns {undefined}
         */
        removeRow(index) {
            if (this.disabled) {
                return;
            }

            this.fundings.splice(index, 1);
            this.emitInput();
        },

        /**
         * Handles a change in the value of a row
         *
         * @returns {undefined}
         */
        onRowChange() {
            this.emitInput();
        },

        /**
         * Emits input for data binding
         *
         * @returns {undefined}
         */
        emitInput() {
            this.$emit('input', this.fundings.map(({ data }) => data));
        },
    },

};

/**
 * @typedef {Object} PlanFundingData
 * @property {Number} type    Type id
 * @property {Number} amount  Amount in euros as a float number
 * @property {String} details
 */

/**
 * @typedef {Object} PlanFunding
 * @property {PlanFundingData} data
 */
