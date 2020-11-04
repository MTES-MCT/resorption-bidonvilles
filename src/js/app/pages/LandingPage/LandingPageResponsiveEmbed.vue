<template>
    <div class="wrapper" :style="paddingStyle">
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        videoRatio: {
            type: String,
            default: "56.25%" /* 16:9 */
        }
    },
    computed: {
        paddingStyle() {
            return `padding-bottom: ${this.videoRatio}`;
        }
    }
};
</script>

<style>
.wrapper {
    position: relative;
    padding-top: 25px;
    height: 0;
}

.wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
