<template>
    <DatepickerV2 label="Date de signalement" v-model="input"></DatepickerV2>
</template>

<script>
module.exports = {
    props: {
        value: {
            type: Date,
            required: false
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
