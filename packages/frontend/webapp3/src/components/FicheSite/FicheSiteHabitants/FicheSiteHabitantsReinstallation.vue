<template>
    <FicheSiteSousRubrique>
        <p class="font-bold">S'agit-il d'une réinstallation ?</p>
        <p>{{ formatBool(town.isReinstallation) }}</p>
    </FicheSiteSousRubrique>

    <FicheSiteSousRubrique v-if="town.reinstallationComments">
        <p class="font-bold">Précisions sur la réinstallation</p>
        <p class="max-w-3xl break-words whitespace-pre-wrap">
            {{ town.reinstallationComments }}
        </p>
    </FicheSiteSousRubrique>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import formatBool from "@/utils/formatBool";

import FicheSiteSousRubrique from "../FicheSiteSousRubrique.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
