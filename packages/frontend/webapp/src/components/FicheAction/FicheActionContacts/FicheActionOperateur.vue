<template>
    <FicheSousRubrique :border="false" :marginTop="false">
        <span class="font-bold">Opérateur(s) ou service(s) en charge</span>
        <CarteUtilisateur
            class="my-2"
            v-for="user in users"
            :key="user.id"
            :user="user"
            :linkToUser="false"
            :hidePhone="hidePhone"
            includeOrganization
        />
    </FicheSousRubrique>
</template>

<script setup>
import { toRefs, computed } from "vue";

import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";
import CarteUtilisateur from "@/components/CarteUtilisateur/CarteUtilisateur.vue";
import sortOperatorsByPrincipal from "@/utils/sortOperatorsByPrincipal";
import usePhoneVisibility from "@/composables/usePhoneVisibility";
import isAnonymizedUser from "@/utils/isAnonymizedUser";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
const { hidePhone } = usePhoneVisibility();
const users = computed(() =>
    sortOperatorsByPrincipal(action.value.operators)
        .flatMap(({ users: orgUsers }) => orgUsers)
        .filter((user) => !isAnonymizedUser(user))
);
</script>
