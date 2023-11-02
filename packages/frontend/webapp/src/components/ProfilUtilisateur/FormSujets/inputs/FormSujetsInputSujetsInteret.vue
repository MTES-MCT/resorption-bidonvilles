<template>
    <CheckableGroup id="interest_topics" :label="labels.interest_topics">
        <Checkbox
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="interest_topics"
            v-model="values.interest_topics"
            variant="checkbox"
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
    return configStore.config.expertise_topics.map((topic) => ({
        value: topic.uid,
        label: topic.label,
    }));
});

const values = useFormValues();
</script>
