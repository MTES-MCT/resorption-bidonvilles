<template>
    <TextArea
        id="water_access_comments"
        label="Informations complémentaires"
        info="Saisissez ici vos remarques, autres remontées d’informations ou descriptions (ex : nombre de points d’eau, de robinets, description des installations…)"
        placeholder="Votre message"
        v-model="input"
        cypressName="water_access_comments"
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
