<template>
    <TextInput label="Nom de l'étude de l'huissier" v-model="input"></TextInput>
</template>

<script>
module.exports = {
    props: {
        value: {
            type: String,
            required: false,
            default: ""
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
