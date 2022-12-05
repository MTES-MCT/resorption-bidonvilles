<template>
    <CheckableGroup id="themes" direction="horizontal" :label="labels.themes">
        <Checkbox
            v-for="themeId in themeIds"
            :key="themeId"
            :value="themeId"
            :label="themes[themeId]"
            name="themes"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import { useConfigStore } from "@/stores/config.store";
import labels from "../FicheSiteModaleMesThemes.labels";

import { CheckableGroup, Checkbox } from "@resorptionbidonvilles/ui";

const themes = computed(() => {
    const configStore = useConfigStore();
    return configStore.config.actor_themes;
});

const themeIds = computed(() => {
    return Object.keys(themes.value).filter((id) => id !== "autre");
});
</script>
