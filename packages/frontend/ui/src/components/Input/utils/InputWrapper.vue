<template>
    <div :class="['relative', withoutMargin ? '' : 'mb-6']">
        <div v-if="hasErrors" class="absolute ml-1 inputWrapper-error w-0.5 h-full bg-red700"></div>
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
