<template>
    <TextArea
        id="pest_animals_details"
        label="Informations complémentaires"
        info="Saisissez ici vos remarques, autres remontées d’informations ou descriptions (ex : rats, punaises de lit…)"
        placeholder="Votre message"
        v-model="input"
        cypressName="pest_animals_comments"
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
