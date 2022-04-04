<template>
    <TextInput
        id="points_eau"
        label="d'accès réguliers à l'eau potable"
        width="w-32"
        v-model="input"
        rules="numeric|min_value:0"
    ></TextInput>
</template>

<script>
export default {
    props: {
        value: {
            type: [String, Number],
            required: false
        }
    },

    data() {
        return {
            input: this.value
        };
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
