<template>
    <DatepickerV2
        id="expected_to_end_at"
        label="Date de fin prévue"
        v-model="input"
        :disabled-dates="{ to: this.disableBefore }"
    ></DatepickerV2>
</template>

<script>
export default {
    props: {
        value: {
            type: Date,
            required: false
        },

        disableBefore: {
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
