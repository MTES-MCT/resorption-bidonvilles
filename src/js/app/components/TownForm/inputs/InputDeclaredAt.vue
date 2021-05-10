<template>
    <DatepickerV2
        id="declared_at"
        label="Date de signalement"
        v-model="input"
        :showMandatoryStar="true"
        rules="required"
        :disabled-dates="{ to: this.disableBefore, from: new Date() }"
        cypressName="declared_at"
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
