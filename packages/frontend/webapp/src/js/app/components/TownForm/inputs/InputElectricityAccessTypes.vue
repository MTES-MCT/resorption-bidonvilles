<template>
    <CheckableGroup
        info="Quelle est la source de l’accès ?"
        validationName="Quelle est la source de l'accès à l'électricité ?"
        id="electricity_access_types"
    >
        <Checkbox
            v-for="value in values"
            v-bind:key="value.id"
            variant="card"
            :label="value.label"
            v-model="checked"
            :checkValue="value.id"
            cypressName="toilet_types"
        ></Checkbox>
    </CheckableGroup>
</template>

<script>
import electricityAccessTypes from "#app/utils/electricity_access_types";

export default {
    props: {
        value: {
            type: Array,
            required: false,
            default: () => []
        }
    },

    data() {
        return {
            checked: this.value,
            values: Object.keys(electricityAccessTypes).map(id => ({
                id,
                label: electricityAccessTypes[id]
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
