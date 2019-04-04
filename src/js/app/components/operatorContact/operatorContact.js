import { get as getConfig } from '#helpers/api/config';

export default {
    props: {
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
            input: {},
            departements: getConfig().departements,
        };
    },
};
