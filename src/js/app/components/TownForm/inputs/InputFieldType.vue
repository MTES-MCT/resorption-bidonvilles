<template>
    <CheckableGroup label="Type de site" id="field_type" rules="required">
        <Radio
            v-for="value in values"
            v-bind:key="value.id"
            variant="card"
            :label="value.label"
            v-model="checked"
            :checkValue="value.id"
            cypressName="field_type"
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
        const { field_types } = getConfig();

        return {
            values: field_types,
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
