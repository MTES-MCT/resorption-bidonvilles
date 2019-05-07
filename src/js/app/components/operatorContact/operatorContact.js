import { get as getConfig } from '#helpers/api/config';

export default {
    props: {
        value: {
            type: Object,
            default: () => ({}),
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        errors: {
            type: Object,
            default: () => ({}),
        },
    },

    data() {
        return {
            input: this.value,
            departements: getConfig().departements,
        };
    },

    watch: {
        value() {
            this.input = this.value;
        },
        input() {
            this.$emit('input', this.input);
        },
    },
};
