<template>
    <CheckableGroup id="request_type" :label="label" direction="row">
        <Checkbox
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            v-model="selectedOption"
            name="request_type"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Checkbox } from "@resorptionbidonvilles/ui";
import items from "@/utils/access_request_types.js";
import { computed, defineProps, toRefs } from "vue";

const props = defineProps({
    label: String,
    requestType: {
        type: String,
        required: false,
    },
});
const { label, requestType } = toRefs(props);

const selectedOption = computed(() => {
    return requestType.value === "access-request" ? requestType.value : "";
});
</script>
