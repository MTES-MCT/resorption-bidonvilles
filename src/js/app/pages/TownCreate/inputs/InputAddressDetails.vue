<template>
    <TextInput
        label="Informations d'accès"
        info="Saisissez ici toutes les informations qui, en plus de l'adresse, peuvent être utiles pour l'accès au site."
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
