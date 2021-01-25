<template>
    <TextArea
        label="Modalités d'accès"
        info="Exemples : groupe électrogène, raccordement à une usine..."
        v-model="input"
    ></TextArea>
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
