<template>
    <div>
        <DatepickerV2
            id="census_conducted_at"
            rules="required|censusConductedAfterCreation:@built_at"
            label="Date du diagnostic"
            v-model="input"
            data-cy-field="census_conducted_at"
            :showMandatoryStar="true"
        ></DatepickerV2>
    </div>
</template>

<script>
import { extend } from "vee-validate";

extend("censusConductedAfterCreation", {
    params: ["target"],
    validate(conductedAt, { target: builtAt }) {
        return builtAt ? conductedAt >= builtAt : true;
    },
    message:
        "La date du diagnostic doit être ultérieure à la date d'installation"
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
