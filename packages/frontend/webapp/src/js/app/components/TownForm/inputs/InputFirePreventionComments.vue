<template>
    <TextArea
        id="fire_prevention_comments"
        label="Précisions"
        placeholder="Votre message"
        v-model="input"
        cypressName="fire_prevention_comments"
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
