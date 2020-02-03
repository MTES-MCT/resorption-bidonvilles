import { get as getConfig } from '#helpers/api/config';

export default {


    props: {
        /**
         * Wether a real amount can be provided
         *
         * @type {Boolean}
         */
        allowRealAmount: {
            type: Boolean,
            required: true,
        },

        /**
         * Index of the row, starting from 0
         *
         * @type {Number}
         */
        index: {
            type: Number,
            required: true,
        },

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
                    realAmount: this.allowRealAmount ? 0.0 : null,
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
            realAmount: this.allowRealAmount ? this.value.realAmount : null,
            details: this.value.details,
        };
    },


    watch: {
        // two-way binding
        value() {
            this.type = this.value.type;
            this.amount = this.value.amount;
            this.realAmount = this.allowRealAmount ? this.value.realAmount : null;
            this.details = this.value.details;
        },

        type() {
            this.emitInput();
        },
        amount() {
            this.emitInput();
        },
        realAmount() {
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
                realAmount: this.realAmount,
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
