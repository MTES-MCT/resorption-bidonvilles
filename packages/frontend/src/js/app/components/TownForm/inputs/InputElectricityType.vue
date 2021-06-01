<template>
    <CheckableGroup
        label=" "
        direction="horizontal"
        id="electricity_type"
        validationName="Accès à l'électricité"
        rules="required"
    >
        <Radio
            v-for="value in values"
            v-bind:key="value.id"
            variant="card"
            :label="value.label"
            v-model="checked"
            :checkValue="value.id"
            cypressName="electricity_type"
        ></Radio>
    </CheckableGroup>
</template>

<script>
import { get as getConfig } from "#helpers/api/config";

export default {
    props: {
        value: {
            type: Number,
            required: false,
            default: undefined
        }
    },

    data() {
        const { electricity_types } = getConfig();

        return {
            values: electricity_types,
            checked: this.value
        };
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
