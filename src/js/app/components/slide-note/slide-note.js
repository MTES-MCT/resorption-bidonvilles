export default {
    props: {
        /**
         * Single-line title
         */
        title: {
            required: true,
            type: String,
        },

        /**
         * HTML content
         */
        content: {
            required: false,
            type: String,
        },
    },

    data() {
        return {
            maxHeight: null,
            visible: true,
        };
    },

    computed: {
        caret() {
            return `caret-${this.visible === true ? 'up' : 'down'}`;
        },
    },

    mounted() {
        this.maxHeight = this.$refs.body.offsetHeight;
        this.refreshHeight();
    },

    methods: {
        toggle() {
            this.visible = !this.visible;
            this.refreshHeight();
        },
        refreshHeight() {
            if (this.visible === true) {
                this.$refs.body.style.maxHeight = `${this.maxHeight}px`;
            } else {
                this.$refs.body.style.maxHeight = '0';
            }
        },
    },
};
