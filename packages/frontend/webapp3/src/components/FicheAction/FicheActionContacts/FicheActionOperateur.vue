<template>
    <FicheSousRubrique>
        <span class="font-bold">Opérateur ou service en charge</span>
        <CarteUtilisateur
            class="my-2"
            v-for="user in plan.operator_contacts"
            :key="user.id"
            :user="user"
            :linkToUser="false"
        />
    </FicheSousRubrique>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";
import CarteUtilisateur from "@/components/CarteUtilisateur/CarteUtilisateur.vue";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);
</script>
