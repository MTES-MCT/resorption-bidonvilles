<template>
    <CheckableGroup id="tags" :label="labels.tags" direction="row">
        <Checkbox
            v-for="item in items"
            :key="item.uid"
            :value="item.uid"
            :label="item.label"
            name="tags"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import { useConfigStore } from "@/stores/config.store";
import labels from "../FicheSiteJournalFormNouveauMessage.labels";

import { CheckableGroup, Checkbox } from "@resorptionbidonvilles/ui";

const configStore = useConfigStore();
const items = computed(() => {
    return configStore.config.regular_comment_tags;
});
</script>
