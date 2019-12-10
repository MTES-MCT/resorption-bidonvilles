import Datepicker from 'vuejs-datepicker';
import { fr as datepickerFr } from 'vuejs-datepicker/dist/locale';
import Autocompleter from './autocompleter/autocompleter.vue';
import Address from './address/address.vue';
import Location from './location/location.vue';
import AddressWithLocation from './address-with-location/address-with-location.vue';
import TownList from './townList/townList.vue';
import PlanFunding from './planFunding/planFunding.vue';
import Collectivity from './collectivity/collectivity.vue';
import Organization from './organization/organization.vue';
import Etp from './etp/etp.vue';
import Audience from './audience/audience.vue';

/**
 * Input types that accept a list of values
 *
 * @type {Array.<string>}
 */
const multipleValueInputs = [
    'selectMultiple',
    'checkbox',
    'autocompleter',
    'townList',
    'planFunding',
    'etp',
];

export default {


    components: {
        Datepicker,
        Autocompleter,
        Address,
        Location,
        AddressWithLocation,
        TownList,
        PlanFunding,
        Collectivity,
        Organization,
        Etp,
        Audience,
    },


    props: {
        /**
         * Unique id of the field
         *
         * @type {String}
         */
        id: {
            type: String,
            required: true,
        },

        /**
         * Whether this input is mandatory or not
         *
         * @type {Boolean}
         */
        mandatory: {
            type: Boolean,
            required: true,
        },

        /**
         * Input type
         *
         * @type {
         *  'hidden',
         *  'text',
         *  'password',
         *  'textarea',
         *  'number',
         *  'select',
         *  'selectMultiple',
         *  'radio',
         *  'checkbox',
         *  'date',
         *  'autocompleter',
         *  'address',
         *  'location',
         *  'addressWithLocation',
         *  'townList',
         *  'planFunding',
         *  'collectivity',
         *  'organization',
         *  'etp',
         *  'audience'
         * }
         */
        type: {
            type: String,
            required: false,
            default: 'text',
        },

        /**
         * Label
         *
         * @type {String}
         */
        label: {
            type: String,
            required: true,
        },

        /**
         * Description
         *
         * @type {String}
         */
        description: {
            type: String,
            required: false,
        },

        /**
         * Options
         *
         * Used by inputs of type:
         * - select
         * - selectMultiple
         * - radio
         * - checkbox
         *
         * Please note that the InputOptionGroup is accepted for selects only.
         *
         * @type {Array.<InputOption>|Array.<InputOptionGroup>}
         */
        options: {
            type: Array,
            required: false,
            default() {
                return [];
            },
        },

        /**
         * Properties specific to the input
         *
         * @type {Object}
         */
        specificProps: {
            type: Object,
            required: false,
            default() {
                return {};
            },
        },

        /**
         * Value of the input
         *
         * @type {Object} Obviously depends on the input type
         */
        value: {
            required: false,
            default() {
                if (multipleValueInputs.indexOf(this.type) !== -1) {
                    return [];
                }

                return undefined;
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
         * List of errors
         *
         * @type {Array.<string>}
         */
        errors: {
            type: Array,
            required: false,
            default() {
                return [];
            },
        },

        /**
         * Message to be displayed as a prefix alert
         *
         * @type {String}
         */
        alertMessage: {
            type: String,
            required: false,
            default: null,
        },
    },


    data() {
        return {
            data: this.value,
            showPassword: false, // for type 'password' only
        };
    },


    computed: {
        props() {
            let defaultProps = {};
            if (this.type === 'date') {
                defaultProps = {
                    language: datepickerFr,
                    mondayFirst: true,
                    fullMonthName: true,
                    format: 'dd MMMM yyyy',
                    calendarButton: true,
                    calendarButtonIconContent: '',
                    clearButton: true,
                };
            }

            return Object.assign(defaultProps, this.specificProps);
        },

        optionsAreGrouped() {
            return this.options && Object.prototype.hasOwnProperty.call(this.options[0], 'options');
        },
    },

    mounted() {
        this.$nextTick(() => {
            this.$emit('input', this.data);
        });
    },

    watch: {
        // two-way binding
        value() {
            this.data = this.value;
        },
        data() {
            this.$emit('input', this.data);
            this.$emit('change');
        },
        options() {
            if (Array.isArray(this.data)) {
                this.data = this.data.filter(v => this.options.indexOf(v) !== -1);
            } else if (this.options.indexOf(this.data) === -1) {
                this.data = undefined;
            }
        },
    },


};

/**
 * @typedef {Object} InputOption
 * @property {String|Number} value
 * @property {String}        label
 */

/**
 * @typedef {Object} InputOptionGroup
 * @property {String}              label
 * @property {Array.<InputOption>} options
 */
