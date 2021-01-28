<template>
    <DatepickerV2
        id="declared_at"
        label="Date de signalement"
        v-model="input"
        rules="declaredAfterInstallation:@built_at"
        :disabled-dates="{ to: this.disableBefore, from: new Date() }"
        cypressName="declared_at"
    ></DatepickerV2>
</template>

<script>
import { extend } from "vee-validate";

extend("declaredAfterInstallation", {
    params: ["target"],
    validate(declaredAt, { target: builtAt }) {
        return declaredAt >= builtAt;
    },
    message:
        "La date de signalement doit être ultérieure à la date d'installation"
});

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
