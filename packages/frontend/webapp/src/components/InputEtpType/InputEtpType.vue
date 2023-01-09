<template>
    <Select :value="value" v-model="input" :withoutMargin="withoutMargin">
        <option value="">- Selectionner un choix -</option>
        <option v-for="item in etpTypes" :key="item.uid" :value="item.uid">
            {{ item.name }}
        </option>
    </Select>
</template>
<script setup>
import { defineProps, toRefs, ref, computed } from "vue";
import { useConfigStore } from "@/stores/config.store";

import { Select } from "@resorptionbidonvilles/ui";
const props = defineProps({
    value: {
        type: String,
        required: false,
    },
    withoutMargin: {
        type: Boolean,
        required: false,
    },
});
const { value, withoutMargin } = toRefs(props);

console.log(value.value);
const configStore = useConfigStore();
configStore.config;
const input = ref(value);

const etpTypes = computed(() => {
    return configStore.config.etp_types;
});
</script>
