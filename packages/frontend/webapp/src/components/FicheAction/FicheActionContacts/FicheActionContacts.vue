<template>
    <FicheRubrique title="Contacts" id="contacts">
        <FicheActionPilotes :action="action" />
        <FicheActionOperateur :action="action" />
    </FicheRubrique>
</template>

<script setup>
import { toRefs } from "vue";

import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import FicheActionPilotes from "./FicheActionPilotes.vue";
import FicheActionOperateur from "./FicheActionOperateur.vue";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
</script>
