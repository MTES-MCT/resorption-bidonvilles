<template>
    <CheckableGroup id="owner_type">
        <Radio
            v-for="item in items"
            :key="item.id"
            :value="item.id"
            :label="item.label"
            name="owner_type"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import { useConfigStore } from "@/stores/config.store";

const configStore = useConfigStore();
const items = computed(() => {
    return configStore.config?.owner_types || [];
});
</script>
