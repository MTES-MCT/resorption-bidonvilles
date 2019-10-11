export default {
    props: {
        log: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            currentItemIndex: 0,
        };
    },

    computed: {
        nextLabel() {
            if (this.currentItemIndex === this.log.items.length - 1) {
                return 'Accéder à la plateforme';
            }

            return 'Suite';
        },

        currentItem() {
            return this.log.items[this.currentItemIndex];
        },
    },

    methods: {
        previous() {
            if (this.currentItemIndex === 0) {
                return;
            }

            this.currentItemIndex -= 1;
            this.syncCarousel();
        },

        next() {
            if (this.currentItemIndex === this.log.items.length - 1) {
                this.$emit('done');
                return;
            }

            this.currentItemIndex += 1;
            this.syncCarousel();
        },

        syncCarousel() {
            const firstImage = this.$refs.carousel.firstChild;
            firstImage.style.marginLeft = `${-1 * firstImage.offsetWidth * this.currentItemIndex}px`;
        },
    },

};
