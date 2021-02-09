<template>
    <DatepickerV2
        label="Date de la décision"
        v-model="input"
        id="justice_rendered_at"
        rules="required|renderedAfterInstallation:@built_at"
        data-cy-field="justice_rendered_at"
        :showMandatoryStar="true"
    ></DatepickerV2>
</template>

<script>
import { extend } from "vee-validate";

extend("renderedAfterInstallation", {
    params: ["target"],
    validate(renderedAt, { target: builtAt }) {
        return renderedAt >= builtAt;
    },
    message:
        "La date de la décision doit être ultérieure à la date d'installation"
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
