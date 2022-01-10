<template>
    <TextArea
        id="reinstallation_comments"
        label="Précisions sur la réinstallation"
        info="Exemple : adresse de l'ancien site, nombre de personnes concernées, etc."
        placeholder="Votre message"
        v-model="input"
        cypressName="reinstallation_comments"
    ></TextArea>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            required: false,
            default: ""
        },
        rules: {
            type: String
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
