<template>
    <div
        :class="['rounded-md bg-white shadow-xs min-w-48', ...classes]"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        variant: String,
        default: () => "default"
    },
    computed: {
        classes() {
            return {
                withoutPadding: "py-0",
                default: "py-1"
            }[this.variant];
        }
    }
};
</script>
