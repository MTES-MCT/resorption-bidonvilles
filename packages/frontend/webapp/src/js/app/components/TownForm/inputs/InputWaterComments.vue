<template>
    <TextArea
        id="water_comments"
        :rules="rules === 'required' ? 'waterComments' : ''"
        label="Modalités d'accès"
        info="Exemples : citerne remplie par les pompiers tous les jours, 3 robinets raccordés par la collectivité, borne incendie… Champ obligatoire si le point d'eau est public."
        placeholder="Votre message"
        v-model="input"
        cypressName="water_comments"
        disabled
    ></TextArea>
</template>

<script>
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";

extend("waterComments", {
    ...required,
    message:
        "Le champ modalités d'accès a l'eau est obligatoire si le point d'eau est public"
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
