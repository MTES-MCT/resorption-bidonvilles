<template>
    <FicheSiteActionsSection :actions="town.actions">
        <template v-slot:empty>Ce site n'est lié à aucune action.</template>
    </FicheSiteActionsSection>
</template>

<script setup>
import { toRefs } from "vue";
import FicheSiteActionsSection from "./FicheSiteActionsSection.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
