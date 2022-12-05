<template>
    <CheckableGroup id="social_origins">
        <Checkbox
            v-for="item in items"
            :key="item.id"
            :value="item.id"
            :label="item.label"
            name="social_origins"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import { CheckableGroup, Checkbox } from "@resorptionbidonvilles/ui";
import { useConfigStore } from "@/stores/config.store";

const configStore = useConfigStore();
const items = computed(() => {
    return configStore.config?.social_origins || [];
});
</script>
