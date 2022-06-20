<template>
    <AutocompleteV2
        id="address"
        label=""
        prefixIcon="search"
        :search="autocomplete"
        :getResultValue="getResultValue"
        validationName="Adresse"
        @submit="submit"
        :rules="rule"
        data-cy-field="address"
        :defaultValue="value"
        :disabled="disabled"
    ></AutocompleteV2>
</template>

<script>
import { extend } from "vee-validate";
import { autocomplete } from "#helpers/addressHelper";

extend("cityAndLabelRequired", {
    validate(value) {
        return !!(value && value.citycode && value.label);
    },
    message: "L'adresse est obligatoire"
});

extend("labelRequired", {
    validate(value) {
        return !!(value && value.label);
    },
    message: "L'adresse est obligatoire"
});

export default {
    props: {
        value: {
            value: Object,
            required: false,
            default() {
                return {
                    label: undefined,
                    citycode: undefined
                };
            }
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },
        rule: {
            type: String, // either "cityAndLabelRequired" or "labelRequired"
            required: false,
            default: "cityAndLabelRequired"
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
    },

    methods: {
        autocomplete(str) {
            if (!str) {
                return [];
            }

            return autocomplete(str);
        },

        getResultValue(value) {
            if (typeof value === "string") {
                return value;
            }

            return value.label;
        },

        submit(result) {
            if (!result) {
                this.input = {
                    label: undefined,
                    citycode: undefined
                };
                this.$emit("change", undefined);
                return;
            }

            const {
                label,
                citycode,
                coordinates: [lng, lat]
            } = result;
            this.input = {
                label,
                citycode
            };
            this.$emit("change", [lat, lng]);
        }
    }
};
</script>
