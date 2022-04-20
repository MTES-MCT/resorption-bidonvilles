export default {
    props: {
        /**
         * Single-line title
         */
        title: {
            required: true,
            type: String
        },

        /**
         * HTML content
         */
        content: {
            required: false,
            type: String
        },

        /**
         * Whether the block should be visible by default
         *
         * @type {Boolean}
         */
        opened: {
            required: false,
            type: Boolean,
            default: true
        },

        /**
         * Font-awesome-icon
         *
         * @type {String}
         */
        icon: {
            required: false,
            type: String,
            default: "info-circle"
        }
    },

    data() {
        return {
            iconName: this.icon,
            maxHeight: null,
            visible: this.opened !== false
        };
    },

    computed: {
        caret() {
            return `caret-${this.visible === true ? "up" : "down"}`;
        }
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
                this.$refs.body.style.maxHeight = "0";
            }
        }
    }
};
