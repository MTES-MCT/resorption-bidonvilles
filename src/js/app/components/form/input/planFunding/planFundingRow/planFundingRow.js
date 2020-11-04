import { get as getConfig } from "#helpers/api/config";

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
                    realAmount: null,
                    details: ""
                };
            }
        },

        /**
         * Whether the input should be disabled or not
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },

        /**
         * Index of the row, starting from 0
         *
         * @type {Number}
         */
        index: {
            type: Number,
            required: true
        },

        /**
         * Year related to the row
         *
         * @type {Number}
         */
        relatedYear: {
            type: Number,
            required: true
        },

        /**
         * Input mode
         *
         * @see planFunding.js
         *
         * @type {"default|"closing"}
         */
        inputMode: {
            type: String,
            required: false,
            default: "default"
        }
    },

    data() {
        const showRealAmount =
            this.inputMode !== "default" || !this.isCurrentYear();
        const allowEdition = !Number.isFinite(this.value.realAmount);

        return {
            /**
             * List of funding-types
             *
             * @type {Array.<FinanceType>}
             */
            financeTypes: getConfig().finance_types || [],

            /**
             *
             */
            showRealAmount,
            allowEdition,

            // please see definition of PlanFundingData
            type: this.value.type,
            amount: this.value.amount,
            realAmount: showRealAmount ? this.value.realAmount : null,
            details: this.value.details
        };
    },

    watch: {
        // two-way binding
        value() {
            this.showRealAmount =
                this.inputMode !== "default" || !this.isCurrentYear();
            this.allowEdition = !Number.isFinite(this.value.realAmount);
            this.type = this.value.type;
            this.amount = this.value.amount;
            this.realAmount = this.showRealAmount
                ? this.value.realAmount
                : null;
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
        }
    },

    methods: {
        /**
         *
         */
        isCurrentYear() {
            return new Date().getFullYear() === this.relatedYear;
        },

        /**
         * Emits an input for data binding
         *
         * @returns {undefined}
         */
        emitInput() {
            this.$emit("input", {
                type: this.type,
                amount: this.amount,
                realAmount: this.realAmount,
                details: this.details
            });
        },

        /**
         * Throws a 'remove' event
         *
         * @returns {undefined}
         */
        remove() {
            this.$emit("onremove");
        }
    }
};

/**
 * @typedef {Object} FinanceType
 * @property {Number} uid
 * @property {String} name
 */
