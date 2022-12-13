<template>
    <CheckableGroup id="tags" :label="labels.tags">
        <Checkbox
            v-for="item in items"
            :key="item.uid"
            :value="item.uid"
            :label="item.name"
            name="tags"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import { useConfigStore } from "@/stores/config.store";
import { CheckableGroup, Checkbox } from "@resorptionbidonvilles/ui";

import labels from "../FormNouvelleQuestion.labels";

const configStore = useConfigStore();
const items = computed(() => {
    return [
        ...configStore.config.question_tags,
        { uid: "other", name: "Autre" },
    ];
});
</script>
