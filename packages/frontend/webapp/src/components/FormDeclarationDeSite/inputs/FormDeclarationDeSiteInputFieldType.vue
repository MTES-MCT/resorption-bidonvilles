<template>
    <CheckableGroup
        id="field_type"
        :label="labels.field_type"
        showMandatoryStar
    >
        <Radio
            v-for="item in items"
            :key="item.id"
            :value="item.id"
            :label="item.label"
            name="field_type"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import { useConfigStore } from "@/stores/config.store";
import labels from "@/components/Common/FormEtFicheSite.labels";

const configStore = useConfigStore();
const items = computed(() => {
    return configStore.config?.field_types || [];
});
</script>
