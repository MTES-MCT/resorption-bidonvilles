<template>
    <TextArea
        label="Modalités d'accès"
        info="Exemples : Citerne de 100 litres remplie par les pompiers tous les jours, 3 robinets raccordés par la collectivité, borne incendie à 200 mètres..."
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
