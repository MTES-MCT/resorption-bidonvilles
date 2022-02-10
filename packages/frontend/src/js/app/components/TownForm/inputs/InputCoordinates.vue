<template>
    <MapV2 v-model="input" :zoom="zoom" :disabled="disabled"></MapV2>
</template>

<script>
export default {
    props: {
        value: {
            value: Array,
            required: false
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    data() {
        return {
            input: this.value
        };
    },

    computed: {
        zoom() {
            return this.input ? 15 : undefined;
        }
    },

    watch: {
        value() {
            this.input = this.value;
        },

        input() {
            this.$emit("input", this.input);
        }
    }
};
</script>
