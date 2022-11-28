<template>
    <FicheSousRubrique>
        <p class="font-bold">S'agit-il d'une réinstallation ?</p>
        <p>{{ formatBool(town.isReinstallation) }}</p>
    </FicheSousRubrique>

    <FicheSousRubrique v-if="town.reinstallationComments">
        <p class="font-bold">Précisions sur la réinstallation</p>
        <p class="max-w-3xl break-words whitespace-pre-wrap">
            {{ town.reinstallationComments }}
        </p>
    </FicheSousRubrique>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import formatBool from "@/utils/formatBool";

import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
