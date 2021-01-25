<template>
    <TextInput
        label="Origine de la décision"
        info="Exemple : tribunal de grande instance"
        v-model="input"
    ></TextInput>
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
