<template>
    <!-- Component used by Radio / Checkbox with card variant -->
    <label :class="checkboxClasses">
        <slot />
    </label>
</template>

<script>
export default {
    props: {
        isChecked: {
            type: Boolean
        },
        variant: {
            type: String
        }
    },
    computed: {
        checkboxClasses() {
            return {
                // card: [
                //     "inline-flex cursor-pointer border-2 rounded-md border-primary px-4 py-3 hover:bg-primary hover:text-white",
                //     this.isChecked ? "bg-primary text-white" : "text-primary"
                // ],
                card: [
                    "inline-flex cursor-pointer px-8 py-1 border-1 border-transparent hover:border-blue600",
                    this.isChecked
                        ? "bg-primary text-white"
                        : " bg-blue200 text-primary"
                ]
            }[this.variant];
        }
    }
};
</script>
