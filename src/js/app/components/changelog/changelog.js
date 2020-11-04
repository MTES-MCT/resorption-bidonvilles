export default {
    props: {
        log: {
            type: Object,
            required: true
        },
        error: {
            type: String,
            required: false,
            default: null
        }
    },

    data() {
        return {
            dataError: this.error ? this.error : null,
            currentItemIndex: 0
        };
    },

    watch: {
        error() {
            this.dataError = this.error ? this.error : null;
        }
    },

    computed: {
        nextLabel() {
            if (this.currentItemIndex === this.log.items.length - 1) {
                return "Accéder à la plateforme";
            }

            return "Suite";
        },

        currentItem() {
            return this.log.items[this.currentItemIndex];
        }
    },

    methods: {
        previous() {
            this.dataError = null;

            if (this.currentItemIndex === 0) {
                return;
            }

            this.currentItemIndex -= 1;
            this.syncCarousel();
        },

        next() {
            this.dataError = null;

            if (this.currentItemIndex === this.log.items.length - 1) {
                this.$emit("done");
                return;
            }

            this.currentItemIndex += 1;
            this.syncCarousel();
        },

        syncCarousel() {
            const firstImage = this.$refs.carousel.firstChild;
            firstImage.style.marginLeft = `${-1 *
                firstImage.offsetWidth *
                this.currentItemIndex}px`;
        }
    }
};
