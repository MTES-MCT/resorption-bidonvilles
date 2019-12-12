export default {
    props: {
        id: String,
        icon: String,
        label: String,
        options: Array,
        opened: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            status: this.opened === true ? 'open' : 'closed',
        };
    },
    computed: {
        toggler() {
            return this.status === 'open' ? '-' : '+';
        },
    },
    methods: {
        toggle() {
            this.status = this.status === 'open' ? 'closed' : 'open';
        },
    },
};
