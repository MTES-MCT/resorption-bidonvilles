<template>
    <DatepickerV2
        id="date"
        label=""
        v-model="input"
        :showMandatoryStar="true"
        rules="required"
        :disabled-dates="{ to: minDate, from: new Date() }"
    ></DatepickerV2>
</template>

<script>
export default {
    props: {
        value: {
            type: Date,
            required: false
        },
        minDate: {
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
