<template>
    <div class="mb-6 relative">
        <div
            v-if="hasErrors"
            class="absolute inputWrapper-error w-1 h-full bg-red600"
        />
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        hasErrors: {
            type: Boolean
        }
    }
};
</script>

<style>
.inputWrapper-error {
    left: -16px;
}
</style>
