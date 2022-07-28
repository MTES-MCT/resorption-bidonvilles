<template>
    <CheckableGroup
        label=" "
        direction="horizontal"
        validationName="Comment les habitants ont-ils accès à l'eau ?"
        id="water_access_type"
        rules="required"
    >
        <Radio
            v-for="value in values"
            v-bind:key="value.id"
            variant="card"
            :label="value.label"
            v-model="checked"
            :checkValue="value.id"
            cypressName="water_access_type"
        ></Radio>
    </CheckableGroup>
</template>

<script>
import waterAccessTypes from "#app/utils/water_access_types";

export default {
    props: {
        value: {
            type: String,
            required: false,
            default: undefined
        }
    },

    data() {
        return {
            checked: this.value,
            values: Object.keys(waterAccessTypes).map(id => ({
                id,
                label: waterAccessTypes[id]
            }))
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
