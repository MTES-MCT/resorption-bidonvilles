<template>
    <CheckableGroup
        label=" "
        id="owner_type"
        validationName="Type de propriétaire"
        rules="required"
    >
        <Radio
            v-for="value in values"
            v-bind:key="value.id"
            variant="card"
            :label="value.label"
            v-model="checked"
            :checkValue="value.id"
            cypressName="owner_type"
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
        const { owner_types } = getConfig();

        return {
            values: owner_types,
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
    },

    methods: {
        isUnknown(value) {
            const label = this.getLabelFor(value);
            return label === undefined || label === "Inconnu";
        },

        getLabelFor(ownerTypeId) {
            const value = this.values.find(({ id }) => id === ownerTypeId);
            if (value === undefined) {
                return undefined;
            }

            return value.label;
        }
    }
};
</script>
