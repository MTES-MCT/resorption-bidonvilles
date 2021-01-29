<template>
    <TextArea
        id="vermin_comments"
        label="Précision (rats, punaises de lits...)"
        v-model="input"
        cypressName="vermin_comments"
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
