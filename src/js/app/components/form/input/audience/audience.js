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
                    out_exclusion: {
                        households: 0,
                        people: 0,
                        women: 0,
                        minors: 0,
                    },
                    out_giveup: {
                        households: 0,
                        people: 0,
                        women: 0,
                        minors: 0,
                    },
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

        'data.out_exclusion.households'() { this.emitInput(); },
        'data.out_exclusion.people'() { this.emitInput(); },
        'data.out_exclusion.women'() { this.emitInput(); },
        'data.out_exclusion.minors'() { this.emitInput(); },

        'data.out_giveup.households'() { this.emitInput(); },
        'data.out_giveup.people'() { this.emitInput(); },
        'data.out_giveup.women'() { this.emitInput(); },
        'data.out_giveup.minors'() { this.emitInput(); },
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
