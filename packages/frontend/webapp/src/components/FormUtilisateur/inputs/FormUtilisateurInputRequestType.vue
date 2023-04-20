<template>
    <CheckableGroup id="request_type" :label="label" direction="row">
        <Checkbox
            v-for="item in items[language]"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="request_type"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Checkbox } from "@resorptionbidonvilles/ui";
import items from "@/utils/access_request_types.js";
import { toRefs } from "vue";

const props = defineProps({
    label: String,
    language: {
        type: String,
        default: "fr",
    },
});
const { label } = toRefs(props);
</script>
