export default {
    props: {
        value: {
            required: true,
            type: Array
        },

        visible: {
            required: false,
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            items: this.value,
            timeout: null,
            id: null
        };
    },

    watch: {
        value() {
            this.items = this.value;
        },

        items() {
            this.$emit("input", this.items);
        },

        visible() {
            if (this.visible === true) {
                this.timeout = setTimeout(
                    () =>
                        document.addEventListener(
                            "click",
                            this.checkOutsideClick
                        ),
                    500
                );
            } else {
                clearTimeout(this.timeout);
                document.removeEventListener("click", this.checkOutsideClick);
            }
        }
    },

    mounted() {
        // eslint-disable-next-line no-underscore-dangle
        this.id = this._uid;
    },

    methods: {
        clean() {
            for (let i = 0; i < this.items.length; i += 1) {
                this.items[i].checked = false;
            }

            this.$emit("clean");
        },

        checkOutsideClick(event) {
            if (
                !this.$refs.container ||
                !this.$refs.container.contains(event.target)
            ) {
                this.$emit("outside-click", event);
            }
        }
    }
};
