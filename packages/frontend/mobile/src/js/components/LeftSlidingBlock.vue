<template>
    <section
        class="relative"
        ref="section"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
    >
        <main>
            <slot name="body" />
        </main>
        <aside
            class="w-0 overflow-hidden absolute right-0 top-0 bottom-0"
            ref="slide"
        >
            <slot name="slider" />
        </aside>
    </section>
</template>

<script>
const SPEED = 300;
const TRESHOLD = 1 / 2;
const SLIDER_WIDTH_RATIO = 1 / 3;
const HOT_ZONE_WIDTH_RATIO = 1 / 4;

export default {
    props: {
        widthRatio: {
            type: Number,
            required: false,
            default() {
                return SLIDER_WIDTH_RATIO;
            },
        },
    },
    data() {
        return {
            isSliding: false,
            originalX: null,
            originalWidth: 0,
            slideDistance: null,
            maxSlideDistance: null,
        };
    },
    methods: {
        onTouchStart(event) {
            // sliding can be ignited only if :
            // - the touch starts from the hotzone (extreme right side of the sliding block)
            // - OR a sliding is still active from a previous touch
            const slidingBlockRightEdge =
                this.$refs.section.offsetLeft + this.$refs.section.offsetWidth;
            const hotzone = {
                min: slidingBlockRightEdge * (1 - HOT_ZONE_WIDTH_RATIO),
                max: slidingBlockRightEdge,
            };
            const x = event.touches[0].pageX;

            if (
                (x < hotzone.min || x > hotzone.max) &&
                this.$refs.slide.offsetWidth <= 0
            ) {
                return;
            }

            // sliding can be begin, initialization
            this.maxSlideDistance =
                this.$refs.section.offsetWidth * this.widthRatio;
            this.isSliding = true;
            this.originalX = x;
            this.originalWidth = this.$refs.slide.offsetWidth;
            this.$refs.slide.style.width = `${this.originalWidth}px`;
            this.$refs.slide.style.removeProperty("transition");
        },
        onTouchMove(event) {
            if (this.originalX === null) {
                return;
            }

            this.slideDistance = this.originalX - event.touches[0].pageX;
            const newWidth = Math.min(
                this.maxSlideDistance,
                this.originalWidth + this.slideDistance
            );
            if (newWidth >= 0) {
                this.$refs.slide.style.width = `${newWidth}px`;
            } else {
                this.$refs.slide.style.width = "0px";
            }
        },
        onTouchEnd() {
            const currentWidth = parseInt(this.$refs.slide.style.width, 10);

            // if the slider is on "closing" position
            let targetWidth = null;
            let distance = currentWidth;

            // if the slider is on "opening" position
            if (currentWidth >= this.maxSlideDistance * TRESHOLD) {
                targetWidth = `${Math.round(this.maxSlideDistance)}px`;
                distance = this.maxSlideDistance - currentWidth;
            }

            const transitionDuration = distance / SPEED;
            this.isSliding = false;
            this.originalX = null;
            this.slideDistance = null;
            this.$refs.slide.style.transition = `width ${transitionDuration}s 0s linear`;
            if (targetWidth === null) {
                this.$refs.slide.style.removeProperty("width");
            } else {
                this.$refs.slide.style.width = targetWidth;
            }
        },
    },
};
</script>
