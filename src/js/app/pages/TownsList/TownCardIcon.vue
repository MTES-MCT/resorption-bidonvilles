<template>
    <div :class="['flex items-center', colorClass]">
        <div class="mr-2 w-4">
            <Icon :icon="icon" />
        </div>
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
                return "text-secondary";
            }

            if (
                (this.value === true && !this.inverted) ||
                (this.value === false && this.inverted)
            ) {
                return "text-green";
            }

            return "text-red";
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
