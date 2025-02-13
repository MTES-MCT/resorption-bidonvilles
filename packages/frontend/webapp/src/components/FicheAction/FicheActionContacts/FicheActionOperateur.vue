<template>
    <FicheSousRubrique :border="false" :marginTop="false">
        <span class="font-bold">Opérateur(s) ou service(s) en charge</span>
        <CarteUtilisateur
            class="my-2"
            v-for="user in users"
            :key="user.id"
            :user="user"
            :linkToUser="false"
            includeOrganization
        />
    </FicheSousRubrique>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";

import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";
import CarteUtilisateur from "@/components/CarteUtilisateur/CarteUtilisateur.vue";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
const users = computed(() => {
    return action.value.operators.map(({ users }) => users).flat();
});
</script>
