<template>
    <FicheGrille>
        <template v-slot:col1>
            <p class="font-bold">Propriétaire</p>
        </template>

        <template v-slot:col2>
            {{ town.ownerType.label }}
        </template>
    </FicheGrille>

    <FicheGrille
        v-if="
            town.ownerType.label !== 'Inconnu' &&
            userStore.hasPermission('shantytown_owner.access')
        "
    >
        <template v-slot:col1>
            <p class="font-bold">Nom du propriétaire</p>
        </template>

        <template v-slot:col2>
            {{ town.owner || "non communiqué" }}
        </template>
    </FicheGrille>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { useUserStore } from "@/stores/user.store";

import FicheGrille from "@/components/FicheRubrique/FicheGrille.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const userStore = useUserStore();
</script>
