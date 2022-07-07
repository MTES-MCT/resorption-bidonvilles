<template>
    <div class="flex items-center">
        <span
            :class="[
                'flex rounded-full text-xs border-2 mr-3 mb-1 h-6 w-6 items-center justify-center',
                colorClass
            ]"
            style="padding: 0.2em"
            ><Icon :icon="icon"
        /></span>
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        value: {
            validator: prop => typeof prop === "boolean" || prop === null
        },
        details: {
            type: Object
        },
        inverted: {
            type: Boolean
        }
    },
    computed: {
        colorClass() {
            if (
                this.value &&
                this.details &&
                this.details.negative.length > 0
            ) {
                return "text-secondary border-secondary";
            }

            if (
                (this.value === true && !this.inverted) ||
                (this.value === false && this.inverted)
            ) {
                return "text-green500 border-green500";
            }

            return "text-red border-red";
        },
        icon() {
            if (
                this.value &&
                this.details &&
                this.details.negative.length > 0
            ) {
                return "exclamation-triangle";
            }

            return {
                null: "question",
                false: this.inverted ? "check" : "times",
                true: this.inverted ? "times" : "check"
            }[this.value];
        }
    }
};
</script>
