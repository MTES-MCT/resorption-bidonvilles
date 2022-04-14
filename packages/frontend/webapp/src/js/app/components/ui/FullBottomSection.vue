<template>
    <div
        ref="container"
        v-bind:class="{
            'flex justify-center items-center text-center': centered
        }"
    >
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        centered: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        window.addEventListener("resize", this.setContainerHeight);
        this.setContainerHeight();
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.setContainerHeight);
    },
    methods: {
        setContainerHeight() {
            const vh = Math.max(
                document.documentElement.clientHeight || 0,
                window.innerHeight || 0
            );
            this.$refs.container.style.height = `${vh -
                this.$refs.container.offsetTop}px`;
        }
    }
};
</script>
