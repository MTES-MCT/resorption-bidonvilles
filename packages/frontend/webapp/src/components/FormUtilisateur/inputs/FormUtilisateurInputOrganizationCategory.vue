<template>
    <CheckableGroup id="organization_category" :label="label">
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="organization_category"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import itemsFn from "@/utils/organization_categories.js";
import { defineProps, toRefs } from "vue";

const props = defineProps({
    label: String,
    allowNewOrganization: Boolean,
});
const { label, allowNewOrganization } = toRefs(props);

const items = computed(() => {
    return itemsFn({ other: allowNewOrganization.value });
});
</script>
