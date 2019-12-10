import { get as getConfig } from '#helpers/api/config';

export default {


    props: {
        /**
         * @type {PlanFundingData}
         */
        value: {
            type: Object,
            required: false,
            default() {
                return {
                    type: null,
                    amount: 0.0,
                    details: '',
                };
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
             * List of funding-types
             *
             * @type {Array.<FinanceType>}
             */
            financeTypes: getConfig().finance_types || [],

            // please see definition of PlanFundingData
            type: this.value.type,
            amount: this.value.amount,
            details: this.value.details,
        };
    },


    watch: {
        // two-way binding
        value() {
            this.type = this.value.type;
            this.amount = this.value.amount;
            this.details = this.value.details;
        },

        type() {
            this.emitInput();
        },
        amount() {
            this.emitInput();
        },
        details() {
            this.emitInput();
        },
    },


    methods: {
        /**
         * Emits an input for data binding
         *
         * @returns {undefined}
         */
        emitInput() {
            this.$emit('input', {
                type: this.type,
                amount: this.amount,
                details: this.details,
            });
        },

        /**
         * Throws a 'remove' event
         *
         * @returns {undefined}
         */
        remove() {
            this.$emit('onremove');
        },
    },

};

/**
 * @typedef {Object} FinanceType
 * @property {Number} uid
 * @property {String} name
 */
