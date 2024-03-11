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
    allowPrivateOrganization: Boolean,
});
const { label, allowNewOrganization, allowPrivateOrganization } = toRefs(props);

const items = computed(() => {
    return itemsFn({
        private_organization: allowPrivateOrganization.value || false,
        other: allowNewOrganization.value,
    });
});
</script>
