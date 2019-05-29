import Datepicker from 'vuejs-datepicker';
import { fr as datepickerFr } from 'vuejs-datepicker/dist/locale';
import Autocompleter from './autocompleter/autocompleter.vue';
import Address from './address/address.vue';
import Location from './location/location.vue';
import AddressWithLocation from './address-with-location/address-with-location.vue';

export default {


    components: {
        Datepicker,
        Autocompleter,
        Address,
        Location,
        AddressWithLocation,
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
         *  'text',
         *  'number',
         *  'select',
         *  'selectMultiple',
         *  'radio',
         *  'checkbox',
         *  'date',
         *  'autocompleter',
         *  'address',
         *  'location',
         *  'addressWithLocation'
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
         * @type {Array.<InputOption>}
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
                if (this.type === 'selectMultiple' || this.type === 'checkbox') {
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
    },


    data() {
        return {
            data: this.value,
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
    },


};

/**
 * @typedef {Object} InputOption
 * @property {String|Number} value
 * @property {String}        label
 */
