export default {
    mounted() {
        document.addEventListener("click", this.checkOutsideClick);
    },
    destroyed() {
        document.removeEventListener("click", this.checkOutsideClick);
    },
    methods: {
        checkOutsideClick(event) {
            // ignore the origin event
            if (this.$refs.wrapper.offsetHeight === 0) {
                return;
            }

            if (!this.$refs.wrapper.contains(event.target)) {
                this.close();
            }
        },
        close() {
            this.$emit("close");
        }
    }
};
