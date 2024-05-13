<template>
    <CheckableGroup
        :id="fieldName"
        :label="labels.police_status"
        showMandatoryStar
    >
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            :name="fieldName"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import items from "@/utils/police_statuses";
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import { toRefs } from "vue";
import labels from "../../FormDeclarationDeSite.labels";
const props = defineProps({
    fieldName: {
        type: String,
        required: true,
    },
    showMandatoryStar: {
        type: Boolean,
        reaquried: false,
        default: false,
    },
});

const { fieldName } = toRefs(props);
</script>
