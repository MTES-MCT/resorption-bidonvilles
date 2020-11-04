<template>
    <div
        :class="
            active
                ? 'transition duration-500 block opacity-100 visible'
                : 'invisible opacity-0 absolute'
        "
    >
        <div class="relative text-xl feedbackText">{{ text }}</div>
        <div class="text-lg font-light">{{ author }}</div>
    </div>
</template>

<script>
export default {
    props: {
        text: {
            type: String
        },
        author: {
            type: String
        },
        active: {
            type: Boolean
        }
    }
};
</script>

<style lang="scss" scoped>
.feedbackText {
    &::before {
        content: "«";
        position: absolute;
        left: -32px;
        top: -24px;

        @apply text-secondary text-size-display-xl;
    }
    &::after {
        content: "»";
        @apply ml-1 text-secondary text-size-lg;
    }
}
</style>
