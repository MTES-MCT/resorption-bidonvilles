<template>
    <DatepickerV2
        label="Date d'octroi du CFP"
        v-model="input"
        id="police_granted_at"
        rules="required|grantedAfterCreation:@built_at|grantedAfterRequest:@police_requested_at"
        data-cy-field="police_granted_at"
        showMandatoryStar="true"
    ></DatepickerV2>
</template>

<script>
import { extend } from "vee-validate";

extend("grantedAfterCreation", {
    params: ["target"],
    validate(grantedAt, { target: builtAt }) {
        return grantedAt >= builtAt;
    },
    message: "La date d'octroi doit être ultérieure à la date d'installation"
});
extend("grantedAfterRequest", {
    params: ["target"],
    validate(grantedAt, { target: requestedAt }) {
        return grantedAt >= requestedAt;
    },
    message: "La date d'octroi doit être ultérieure à la date de la demande"
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
