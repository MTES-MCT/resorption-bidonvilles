<template>
    <TextInput
        id="census_conducted_by"
        label="Intervenant en charge du diagnostic"
        v-model="input"
        rules="required"
        cypressName="census_conducted_by"
        :showMandatoryStar="true"
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
