<template>
    <TextArea
        id="water_comments"
        :rules="rules"
        label="Modalités d'accès"
        info="Exemples : citerne remplie par les pompiers tous les jours, 3 robinets raccordés par la collectivité, borne incendie…"
        placeholder="Votre message"
        v-model="input"
        cypressName="water_comments"
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
