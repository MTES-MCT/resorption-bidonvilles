<template>
    <DatepickerV2
        id="built_at"
        label="Date d'installation"
        v-model="input"
        rules="required"
        :showMandatoryStar="true"
        :disabled-dates="{ from: new Date() }"
        cypressName="built_at"
    ></DatepickerV2>
</template>

<script>
export default {
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
