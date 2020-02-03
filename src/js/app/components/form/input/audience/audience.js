/* eslint-disable object-shorthand */
export default {

    props: {
        /**
         * Value
         *
         * @type {Object}
         */
        value: {
            type: Object,
            required: false,
            default() {
                return {
                    in: {
                        households: 0,
                        people: 0,
                        women: 0,
                        minors: 0,
                    },
                    out_positive: {
                        households: 0,
                        people: 0,
                        women: 0,
                        minors: 0,
                    },
                    out_abandoned: {
                        households: 0,
                        people: 0,
                        women: 0,
                        minors: 0,
                    },
                    out_excluded: {
                        households: 0,
                        people: 0,
                        women: 0,
                        minors: 0,
                    },
                };
            },
        },

        /**
         * In-only
         *
         * Whether the "in" fields only should be shown
         *
         * @type {Boolean}
         */
        inOnly: {
            type: Boolean,
            required: false,
            default: false,
        },

        /**
         * Out-only
         *
         * Whether the "out" fields only should be shown
         *
         * @type {Boolean}
         */
        outOnly: {
            type: Boolean,
            required: false,
            default: false,
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
            data: this.value,
        };
    },


    watch: {
        'data.in.households'() { this.emitInput(); },
        'data.in.people'() { this.emitInput(); },
        'data.in.women'() { this.emitInput(); },
        'data.in.minors'() { this.emitInput(); },

        'data.out_positive.households'() { this.emitInput(); },
        'data.out_positive.people'() { this.emitInput(); },
        'data.out_positive.women'() { this.emitInput(); },
        'data.out_positive.minors'() { this.emitInput(); },

        'data.out_abandoned.households'() { this.emitInput(); },
        'data.out_abandoned.people'() { this.emitInput(); },
        'data.out_abandoned.women'() { this.emitInput(); },
        'data.out_abandoned.minors'() { this.emitInput(); },

        'data.out_excluded.households'() { this.emitInput(); },
        'data.out_excluded.people'() { this.emitInput(); },
        'data.out_excluded.women'() { this.emitInput(); },
        'data.out_excluded.minors'() { this.emitInput(); },
    },


    mounted() {
        this.emitInput();
    },


    methods: {
        emitInput() {
            this.$emit('input', this.data);
        },
    },

};
