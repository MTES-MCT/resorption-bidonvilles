<template>
    <div
        :class="['rounded-md bg-white shadow-xs min-w-48', ...classes]"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu"
        v-bind="$attrs"
    >
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        variant: {
            type: String,
            default: "default"
        }
    },
    computed: {
        classes() {
            const variants = {
                withoutPadding: ["py-0"],
                default: ["py-1"]
            };

            let variant = this.variant;
            if (!Object.keys(variants).includes(this.variant)) {
                variant=  "default";
            }

            return variants[variant];
        }
    }
};
</script>
