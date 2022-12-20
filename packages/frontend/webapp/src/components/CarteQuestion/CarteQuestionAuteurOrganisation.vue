<template>
    <div>
        <CarteQuestionAuteur :auteur="auteur" />
        <CarteQuestionOrganisation :organization="auteur.organization" />
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import CarteQuestionAuteur from "./CarteQuestionAuteur.vue";
import CarteQuestionOrganisation from "./CarteQuestionOrganisation.vue";

const props = defineProps({
    auteur: Object,
});
const { auteur } = toRefs(props);
</script>
