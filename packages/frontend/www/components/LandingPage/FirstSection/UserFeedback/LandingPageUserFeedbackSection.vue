<template>
    <blockquote
        :class="
            active
                ? 'transition duration-500 block opacity-100 visible'
                : 'invisible opacity-0 absolute'
        "
    >
        <p class="relative text-xl feedbackText">{{ text }}</p>
        <footer class="text-lg font-light">{{ author }}</footer>
    </blockquote>
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

<style scoped>
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
