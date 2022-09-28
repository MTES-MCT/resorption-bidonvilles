<template>
    <article
        class="flex justify-between items-center px-2 py-1 bg-green text-white opacity-0 notification"
        ref="container"
    >
        <p>
            <span class="text-xs mr-1"><Icon v-if="icon" :icon="icon"/></span>
            {{ text }}
        </p>
        <Icon icon="times" @click.native="close" />
    </article>
</template>

<style scoped>
.notification {
    transition: opacity 0.3s 0s linear;
}
</style>

<script>
import { Icon } from "@resorptionbidonvilles/ui";

const MINIMUM_DURATION = 1000;

export default {
    components: { Icon },

    props: {
        id: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: false
        },
        duration: {
            type: Number,
            required: false,
            default: 5000 // in ms
        }
    },

    data() {
        return {
            isOpening: false,
            isClosing: false,
            openingTimeout: null,
            closingTimeout: null
        };
    },

    beforeDestroy() {
        clearTimeout(this.openingTimeout);
        clearTimeout(this.closingTimeout);
    },

    mounted() {
        this.openingTimeout = setTimeout(this.open, 100);
        this.closingTimeout = setTimeout(
            this.close,
            Math.max(MINIMUM_DURATION, this.duration)
        );
    },

    methods: {
        open() {
            if (this.isOpening || this.isClosing) {
                return;
            }

            this.isOpening = true;
            this.$refs.container.addEventListener(
                "transitionend",
                this.onOpened
            );
            this.$refs.container.style.opacity = 1;
        },
        close() {
            if (this.isOpening || this.isClosing) {
                return;
            }

            this.isClosing = true;
            clearTimeout(this.closingTimeout);
            this.$refs.container.addEventListener(
                "transitionend",
                this.onClosed
            );
            this.$refs.container.style.opacity = 0;
        },
        onOpened() {
            this.$refs.container.removeEventListener(
                "transitionend",
                this.onOpened
            );
            this.isOpening = false;
        },
        onClosed() {
            this.$refs.container.removeEventListener(
                "transitionend",
                this.onClosed
            );
            this.isClosing = false;
            this.$store.dispatch("notifications/remove", this.id);
        }
    }
};
</script>
