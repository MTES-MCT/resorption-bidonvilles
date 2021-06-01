<template>
    <DatepickerV2
        id="built_at"
        label="Date d'installation"
        v-model="input"
        rules="declaredBeforeDeclaration:@declared_at"
        :disabled-dates="{ from: this.disableAfter || new Date() }"
        cypressName="built_at"
    ></DatepickerV2>
</template>

<script>
import { extend } from "vee-validate";

extend("declaredBeforeDeclaration", {
    params: ["target"],
    validate(builtAt, { target: declaredAt }) {
        return !declaredAt || builtAt <= declaredAt;
    },
    message:
        "La date d'installation doit être antérieure à la date de signalement"
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
