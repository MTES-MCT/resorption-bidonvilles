<template>
    <DatepickerV2
        id="police_requested_at"
        label="Date de la demande du CFP"
        v-model="input"
        rules="required|requestedAfterCreation:@built_at"
        data-cy-field="police_requested_at"
        showMandatoryStar="true"
    ></DatepickerV2>
</template>

<script>
import { extend } from "vee-validate";

extend("requestedAfterCreation", {
    params: ["target"],
    validate(requestedAt, { target: builtAt }) {
        return requestedAt >= builtAt;
    },
    message:
        "La date de la demande doit être ultérieure à la date d'installation"
});

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
