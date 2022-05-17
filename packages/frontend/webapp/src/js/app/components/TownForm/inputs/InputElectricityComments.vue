<template>
    <TextArea
        id="electricity_comments"
        label="Modalités d'accès"
        info="Exemples : groupe électrogène, raccordement à une usine..."
        v-model="input"
        cypressName="electricity_comments"
        placeholder="Votre message"
        disabled
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
