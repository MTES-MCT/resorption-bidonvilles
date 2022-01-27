<template>
    <TextInput
        id="location_details"
        label="Préciser"
        validationName="Précisions sur le cadre du dispositif"
        :showMandatoryStar="true"
        rules="required"
        v-model="input"
    ></TextInput>
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
