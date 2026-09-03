<template>
    <FicheSousRubrique>
        <p class="font-bold">Coordonnées GPS</p>

        <ButtonGPS :town="town" />
    </FicheSousRubrique>
</template>

<script setup>
import { toRefs } from "vue";

import ButtonGPS from "@/components/ButtonGPS/ButtonGPS.vue";
import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
