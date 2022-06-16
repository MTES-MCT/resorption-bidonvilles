<template>
    <TextArea
        id="water_access_is_continuous_details"
        info="Veuillez préciser :"
        validationName="Veuillez préciser la discontinuité de l'accès à l'eau"
        v-model="input"
        cypressName="water_access_is_continuous_details"
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
