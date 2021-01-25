<template>
    <div>
        <DatepickerV2 label="Date du diagnostic" v-model="input"></DatepickerV2>
    </div>
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
