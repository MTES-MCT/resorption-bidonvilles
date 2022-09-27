<template>
    <div
        class="fixed h-screen w-screen left-0 top-0 overflow-hidden"
        ref="container"
        @click="onClick"
    >
        <div
            class="absolute h-full w-full left-0 top-0 bg-black z-1 background-block"
            ref="background"
        ></div>
        <div
            class="absolute h-full w-full left-0 bg-white z-50 bottom-sliding-block overflow-scroll"
            ref="slider"
        >
            <header
                class="pt-2 pb-4 text-center flex justify-between items-center"
            >
                <div class="w-12"></div>
                <span class="flex-1 text-lg text-primary"
                    ><slot name="header"></slot
                ></span>
                <div class="w-12 text-primary">
                    <Button
                        icon="times"
                        variant="textPrimary"
                        size="lg"
                        @click="hide"
                    />
                </div>
            </header>

            <main>
                <slot name="body" />
            </main>
        </div>
    </div>
</template>

<style scoped>
.background-block {
    transition: opacity 0.6s 0s linear;
}

.bottom-sliding-block {
    transition: top 0.6s 0s ease-in-out;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}
</style>

<script>
import { Button } from "@resorptionbidonvilles/ui";
const TOP_MARGIN = 50;

export default {
    components: {
        Button
    },
    data() {
        return {
            sliding: false
        };
    },
    mounted() {
        this.$refs.container.style.display = "none";
        this.$refs.background.style.opacity = 0;
        this.$refs.slider.style.top = `${document.body.offsetHeight}px`;
        this.$refs.slider.addEventListener("transitionend", this.onSlideEnd);
    },
    beforeDestroy() {
        this.$refs.slider.removeEventListener("transitionend", this.onSlideEnd);
    },
    methods: {
        show() {
            if (this.sliding === true) {
                return;
            }

            this.sliding = true;
            this.$refs.container.style.display = "block";
            setTimeout(() => {
                this.$refs.background.style.opacity = 0.75;
                this.$refs.slider.style.top = `${TOP_MARGIN}px`;
            }, 100);
        },
        hide() {
            if (this.sliding === true) {
                return;
            }

            this.sliding = true;
            this.$refs.background.style.opacity = 0;
            this.$refs.slider.style.top = `${document.body.offsetHeight}px`;
        },
        onClick(event) {
            if (
                this.$refs.slider === event.target ||
                this.$refs.slider.contains(event.target)
            ) {
                return;
            }

            this.hide();
        },
        onSlideEnd() {
            if (this.$refs.slider.style.top !== `${TOP_MARGIN}px`) {
                // when closing is done, hide the whole container
                this.$refs.container.style.display = "none";
            }

            this.sliding = false;
        }
    }
};
</script>
