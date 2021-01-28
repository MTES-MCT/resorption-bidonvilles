<template>
    <AutocompleteV2
        id="address"
        label=""
        prefixIcon="search"
        :search="autocomplete"
        :getResultValue="getResultValue"
        validationName="Adresse"
        @submit="submit"
        data-cy-field="address"
        :defaultValue="value.label || ''"
    ></AutocompleteV2>
</template>

<script>
import { autocomplete } from "#helpers/addressHelper";

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

        getResultValue({ label }) {
            return label;
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
