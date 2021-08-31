<template>
    <CheckableGroup label=" ">
        <Checkbox
            v-for="value in values"
            v-bind:key="value.id"
            variant="card"
            :label="value.label"
            v-model="checked"
            :checkValue="value.id"
            cypressName="social_origins"
        ></Checkbox>
    </CheckableGroup>
</template>

<script>
import { get as getConfig } from "#helpers/api/config";

export default {
    props: {
        value: {
            type: Array,
            required: false,
            default: () => []
        }
    },

    data() {
        const { social_origins } = getConfig();

        return {
            values: social_origins,
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
