<template>
    <CheckableGroup
        label=""
        id="location_type"
        validationName="Cadre de l'action"
        rules="required"
    >
        <Radio
            v-for="locationType in interventionLocationTypes"
            :key="locationType.id"
            variant="card"
            :label="locationType.label"
            v-model="checked"
            :checkValue="locationType.value"
            :disabled="disabled"
        ></Radio>
    </CheckableGroup>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    props: {
        value: {
            type: String,
            required: false,
            default: undefined
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    data() {
        return {
            checked: this.value
        };
    },
    computed: {
        ...mapGetters({
            interventionLocationTypes: "plansInterventionLocation"
        })
    },
    watch: {
        value() {
            this.checked = this.value;
        },

        checked() {
            this.$emit("input", this.checked);
        }
    }
};
</script>
