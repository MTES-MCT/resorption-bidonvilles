<template>
    <TextArea
        id="water_access_is_unequal_details"
        info="Veuillez préciser :"
        validationName="Veuillez préciser les inégalités d'accès à l'eau"
        v-model="input"
        cypressName="water_access_is_unequal_details"
        placeholder="Votre message"
        rules="required"
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
