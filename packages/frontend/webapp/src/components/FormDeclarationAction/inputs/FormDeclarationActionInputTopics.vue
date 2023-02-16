<template>
    <CheckableGroup id="topics" :label="labels.topics" showMandatoryStar>
        <Checkbox
            v-for="item in items"
            :key="item.uid"
            :value="item.uid"
            :label="item.name"
            name="topics"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import { CheckableGroup, Checkbox } from "@resorptionbidonvilles/ui";
import { useConfigStore } from "@/stores/config.store";
import labels from "../FormDeclarationAction.labels";

const configStore = useConfigStore();
const items = computed(() => {
    return configStore.config?.topics || [];
});
</script>
