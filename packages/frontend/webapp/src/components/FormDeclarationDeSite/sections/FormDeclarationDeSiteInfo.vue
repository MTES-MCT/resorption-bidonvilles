<template>
    <p v-if="mode === 'report'" class="bg-yellow-200 p-4 mb-6">
        <Icon icon="triangle-exclamation" class="mr-1" />
        <span class="font-bold">Les données ne seront pas enregistrées</span
        ><br />

        A la validation de ce formulaire, les données renseignées ne seront pas
        enregistrées sur la plateforme mais transmises aux administrateurs de la
        plateforme pour validation
    </p>

    <PanelInfo icon="flag" defaultStatus="open">
        <template v-slot:title>Qu'est-ce qu'un site ?</template>
        <template v-slot:content>
            Un site est un bidonville ou squat occupé de manière informelle à
            des fins d'habitation par plusieurs familles ou personnes, les
            services de base (eau, électricité, gestion des déchets…) y sont
            généralement absents. Tous les sites, quelque soit l'origine et le
            nombre des personnes, peuvent être renseignés.
        </template>
    </PanelInfo>
</template>

<script setup>
import { toRefs } from "vue";
import { Icon, PanelInfo } from "@resorptionbidonvilles/ui";

const props = defineProps({
    mode: {
        type: String,
        required: true,
    },
});
const { mode } = toRefs(props);
</script>
