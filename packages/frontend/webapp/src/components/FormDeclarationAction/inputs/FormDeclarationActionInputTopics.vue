<template>
    <CheckableGroup id="topics" :label="labels.topics" showMandatoryStar>
        <Checkbox
            v-for="item in items"
            :key="item.uid"
            :value="item.uid"
            :label="item.name"
            name="topics"
            v-bind="$attrs"
            v-model="values.topics"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import { CheckableGroup, Checkbox } from "@resorptionbidonvilles/ui";
import { useConfigStore } from "@/stores/config.store";
import labels from "../FormDeclarationAction.labels";
import { useFormValues } from "vee-validate";

const configStore = useConfigStore();
const items = computed(() => {
    return configStore.config?.topics || [];
});

const values = useFormValues();
</script>
