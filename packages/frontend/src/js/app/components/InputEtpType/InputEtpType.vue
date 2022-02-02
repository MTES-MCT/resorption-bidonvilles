<template>
    <Select v-model="input" :withoutMargin="withoutMargin">
        <SelectOption value="">- Selectionner un choix -</SelectOption>
        <SelectOption
            v-for="item in etpTypes"
            :key="item.uid"
            :value="item.uid"
            >{{ item.name }}</SelectOption
        >
    </Select>
</template>

<script>
import { get as getConfig } from "#helpers/api/config";

export default {
    props: {
        value: {
            type: String,
            required: false
        },
        withoutMargin: {
            type: Boolean,
            required: false
        }
    },

    data() {
        const { etp_types: etpTypes } = getConfig();

        return {
            input: this.value,
            etpTypes
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
