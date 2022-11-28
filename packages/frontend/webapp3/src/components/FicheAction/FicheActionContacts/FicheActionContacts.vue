<template>
    <FicheRubrique title="Contacts" id="contacts">
        <FicheActionPilotes :plan="plan" />
        <FicheActionOperateur :plan="plan" />
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import FicheActionPilotes from "./FicheActionPilotes.vue";
import FicheActionOperateur from "./FicheActionOperateur.vue";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);
</script>
