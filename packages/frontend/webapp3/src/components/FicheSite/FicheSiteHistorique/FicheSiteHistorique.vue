<template>
    <PanneauLateral icon="history" ref="panneauLateral">
        <template v-slot:header>Historique des modifications</template>

        <FicheSiteHistoriqueItem
            v-if="town.closedAt"
            :author="town.updatedBy"
            :date="town.updatedAt"
            >Fermeture du site</FicheSiteHistoriqueItem
        >

        <div
            class="text-sm font-bold mt-4"
            :class="town.changelog.length < 1 ? 'mb-4' : ''"
        >
            {{ town.changelog.length >= 1 ? town.changelog.length : "Aucune" }}
            modification{{ town.changelog.length > 1 ? "s" : "" }}
        </div>

        <FicheSiteHistoriqueItem
            v-for="changelog in town.changelog"
            :key="changelog.id"
            :author="changelog.author"
            :date="changelog.date"
            :diff="changelog.diff"
        />

        <FicheSiteHistoriqueItem :author="town.createdBy" :date="town.createdAt"
            >Déclaration du site</FicheSiteHistoriqueItem
        >
    </PanneauLateral>
</template>

<script setup>
import { defineProps, toRefs, ref, defineExpose } from "vue";

import { PanneauLateral } from "@resorptionbidonvilles/ui";
import FicheSiteHistoriqueItem from "./FicheSiteHistoriqueItem/FicheSiteHistoriqueItem.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const panneauLateral = ref(null);

defineExpose({
    open() {
        panneauLateral.value.open();
    },
});
</script>
