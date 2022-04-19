<template>
    <DatepickerV2
        id="started_at"
        label="Date de début"
        v-model="input"
        rules="required|declaredBeforeEnd:@expected_to_end_at"
        :disabled-dates="{ from: this.disableAfter }"
        :showMandatoryStar="true"
    ></DatepickerV2>
</template>

<script>
import { extend } from "vee-validate";

extend("declaredBeforeEnd", {
    params: ["target"],
    validate(startedAt, { target: expectedToEndAt }) {
        return !expectedToEndAt || startedAt <= expectedToEndAt;
    },
    message: "La date de début doit être antérieure à la date de fin prévue"
});
export default {
    props: {
        value: {
            type: Date,
            required: false
        },

        disableAfter: {
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
