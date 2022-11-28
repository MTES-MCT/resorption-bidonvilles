<template>
    <FicheSousRubrique :border="false" :marginTop="false">
        <span class="font-bold"
            >Pilote{{ plan.government_contacts.length > 1 ? "s" : "" }}</span
        >
        <CarteUtilisateur
            class="my-2"
            v-for="user in plan.government_contacts"
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
