<template>
    <TextArea
        id="goals"
        label="Objectifs"
        validationName="Objectifs"
        rules="required"
        :showMandatoryStar="true"
        :placeholder="placeholder"
        v-model="input"
        rows="10"
    ></TextArea>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            required: false,
            default: ""
        }
    },

    data() {
        return {
            input: this.value,
            placeholder: `Précisez les objectifs, les enjeux, le contexte du dispositif

Par exemple : résorber le bidonville, scolariser 80% des enfants identifiés en bidonvilles`
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
