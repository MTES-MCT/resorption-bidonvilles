<template>
    <FicheRubrique title="Actions">
        <FicheSiteOuvertActions :town="town" v-if="town.closedAt === null" />
        <FicheSiteFermeActions :town="town" v-else />
    </FicheRubrique>
</template>

<script setup>
import { toRefs } from "vue";
import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import FicheSiteOuvertActions from "./FicheSiteOuvertActions.vue";
import FicheSiteFermeActions from "./FicheSiteFermeActions.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
