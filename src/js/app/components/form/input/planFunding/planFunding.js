import PlanFundingRow from "./planFundingRow/planFundingRow.vue";

export default {
    components: {
        PlanFundingRow
    },

    props: {
        /**
         * @type {Array.<Object>}
         */
        value: {
            type: Array,
            required: false,
            default() {
                return [];
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
         * The oldest year that can be provided
         *
         * @type {Number|null}
         */
        minYear: {
            type: Number,
            required: false,
            default: null
        },

        /**
         * Input mode
         *
         * Three possible modes:
         * - "default": new rows are allowed, all inputs are enabled except the realAmount
         *   of the current year
         * - "closing": new rows are not allowed, all inputs are disabled except empty realAmounts
         *   (even the ones of the current year)p
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
        return {
            /**
             * Upper limit for focusedYear
             *
             * @type {Number}
             */
            maxYear: new Date().getFullYear(),

            /**
             * Currently edited year
             *
             * @type {Number}
             */
            focusedYear: new Date().getFullYear(),

            /**
             * Funding rows
             *
             * @type {Array.<Object>}
             */
            fundings: this.value.map(({ year, data }) => ({
                year,
                data: data.map(d => ({
                    data: d
                }))
            }))
        };
    },

    computed: {
        allowRealAmount() {
            return (
                this.inputMode === "closing" ||
                this.focusedYear < new Date().getFullYear()
            );
        },
        currentFundings() {
            const currentFundings = this.getCurrentFundings();
            if (currentFundings === undefined) {
                return [];
            }

            return currentFundings.data;
        }
    },

    watch: {
        // two-way binding
        value() {
            this.fundings = this.value.map(({ year, data }) => ({
                year,
                data: data.map(d => ({
                    data: d
                }))
            }));
        }
    },

    methods: {
        /**
         * Returns the funding rows for currently selected year
         *
         * @returns {Array.<PlanFunding>}
         */
        getCurrentFundings() {
            return this.fundings.find(({ year }) => year === this.focusedYear);
        },

        /**
         * Adds a funding row
         *
         * @returns {undefined}
         */
        addRow() {
            if (this.disabled) {
                return;
            }

            let currentFundings = this.getCurrentFundings();
            if (currentFundings === undefined) {
                currentFundings = {
                    year: this.focusedYear,
                    data: []
                };
                this.fundings.push(currentFundings);
            }

            currentFundings.data.push({
                data: {
                    type: null,
                    amount: 0.0,
                    realAmount: null,
                    details: ""
                }
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

            const currentFundings = this.getCurrentFundings();
            if (currentFundings === undefined) {
                return;
            }

            currentFundings.data.splice(index, 1);
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
            this.$emit(
                "input",
                this.fundings.map(({ year, data }) => ({
                    year,
                    data: data.map(({ data: d }) => d)
                }))
            );
        },

        /**
         * Switches to next year
         *
         * @returns {undefined}
         */
        showNextYear() {
            this.focusedYear = Math.min(this.maxYear, this.focusedYear + 1);
        },

        /**
         * Switches to previous year
         *
         * @returns {undefined}
         */
        showPreviousYear() {
            if (this.minYear === null) {
                this.focusedYear -= 1;
            } else {
                this.focusedYear = Math.max(this.minYear, this.focusedYear - 1);
            }
        }
    }
};

/**
 * @typedef {Object} PlanFundingData
 * @property {Number} type       Type id
 * @property {Number} amount     Amount in euros as a float number
 * @property {Number} realAmount Amount in euros as a float number
 * @property {String} details
 */

/**
 * @typedef {Object} PlanFunding
 * @property {PlanFundingData} data
 */
