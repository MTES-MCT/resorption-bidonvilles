export default {
    props: {
        id: String,
        icon: {
            type: String,
            required: false,
            default: null
        },
        faIcon: {
            type: String,
            required: false,
            default: null
        },
        label: String,
        options: Array,
        opened: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            status: this.opened === true ? "open" : "closed"
        };
    },
    computed: {
        toggler() {
            return this.status === "open" ? "-" : "+";
        }
    },
    methods: {
        toggle() {
            this.status = this.status === "open" ? "closed" : "open";
        }
    }
};
