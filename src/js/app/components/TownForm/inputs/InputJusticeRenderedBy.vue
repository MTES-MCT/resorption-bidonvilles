<template>
    <TextInput
        id="justice_rendered_by"
        label="Origine de la décision"
        info="Exemple : tribunal de grande instance"
        v-model="input"
        rules="required"
        cypressName="justice_rendered_by"
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
