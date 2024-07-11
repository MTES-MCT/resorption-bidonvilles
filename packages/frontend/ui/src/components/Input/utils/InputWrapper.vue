<template>
    <div :class="['relative', withoutMargin ? '' : 'mb-6']">
        <div v-if="hasErrors" class="absolute inputWrapper-error w-1 h-full bg-red600"></div>
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        hasErrors: {
            type: Boolean
        },
        withoutMargin: {
            required: false,
            type: Boolean,
            default: false
        }
    }
};
</script>

<style>
.inputWrapper-error {
    left: -16px;
}
</style>
