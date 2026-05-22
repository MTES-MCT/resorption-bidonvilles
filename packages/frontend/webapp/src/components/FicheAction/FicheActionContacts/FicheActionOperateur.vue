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
            displayLeadOperatorInfo
        />
    </FicheSousRubrique>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";

import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";
import CarteUtilisateur from "@/components/CarteUtilisateur/CarteUtilisateur.vue";
import sortOperatorsByPrincipal from "@/utils/sortOperatorsByPrincipal";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
const isDeactivatedUser = (user) =>
    user.first_name === "Utilisateur" && user.last_name === "Désactivé";
const users = computed(() =>
    sortOperatorsByPrincipal(action.value.operators)
        .flatMap(({ users: orgUsers }) => orgUsers)
        .filter((user) => !isDeactivatedUser(user))
);
</script>
