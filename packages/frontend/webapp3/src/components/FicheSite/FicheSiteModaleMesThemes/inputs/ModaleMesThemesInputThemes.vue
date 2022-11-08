<template>
    <CheckableGroup id="themes" direction="horizontal" :label="labels.themes">
        <Checkbox
            v-for="themeId in themeIds"
            :key="themeId"
            :value="themeId"
            :label="themes[themeId]"
            v-model="$props.default"
            name="themes"
        />
    </CheckableGroup>
</template>

<script setup>
import { defineProps, computed } from "vue";
import { useConfigStore } from "@/stores/config.store";
import labels from "../FicheSiteModaleMesThemes.labels";

import { CheckableGroup, Checkbox } from "@resorptionbidonvilles/ui";

defineProps({
    default: {
        type: Array,
        required: false,
        default: () => [],
    },
});
const themes = computed(() => {
    const configStore = useConfigStore();
    return configStore.config.actor_themes;
});

const themeIds = computed(() => {
    return Object.keys(themes.value).filter((id) => id !== "autre");
});
</script>
