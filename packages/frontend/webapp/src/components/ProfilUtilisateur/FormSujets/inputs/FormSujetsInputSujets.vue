<template>
    <CheckableGroup id="tags" :label="labels.tags">
        <Checkbox
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            variant="checkbox"
            name="tags"
            v-model="values.tags"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import { useFormValues } from "vee-validate";
import { CheckableGroup, Checkbox } from "@resorptionbidonvilles/ui";
import labels from "../FormSujets.labels";
import { useConfigStore } from "@/stores/config.store";

const configStore = useConfigStore();
const items = computed(() => {
    return configStore.config.question_tags.map((tag) => ({
        value: tag.uid,
        label: tag.name,
    }));
});

const values = useFormValues();
</script>
