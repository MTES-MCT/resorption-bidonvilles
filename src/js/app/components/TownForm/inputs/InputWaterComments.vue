<template>
    <TextArea
        id="water_comments"
        :rules="rules === 'required' ? 'waterComments' : ''"
        label="Modalités d'accès"
        info="Exemples : citerne remplie par les pompiers tous les jours, 3 robinets raccordés par la collectivité, borne incendie… Champ obligatoire si le point d'eau est public."
        placeholder="Votre message"
        v-model="input"
        cypressName="water_comments"
    ></TextArea>
</template>

<script>
import { extend } from "vee-validate";

extend("waterComments", {
    validate(value) {
        return {
            required: true,
            valid: ["", null, undefined].indexOf(value) === -1
        };
    },
    message: "Le champ est obligatoire lorsque le point d'eau est public."
});

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
