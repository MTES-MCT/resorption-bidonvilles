<template>
    <TextArea
        id="water_access_type_details"
        info="Veuillez préciser les modalités d'accès"
        v-model="input"
        cypressName="water_access_type_details"
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
