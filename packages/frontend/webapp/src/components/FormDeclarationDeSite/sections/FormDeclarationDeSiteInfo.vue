<template>
    <p v-if="mode === 'report'" class="bg-yellow-200 p-4 mb-6">
        <Icon icon="triangle-exclamation" class="mr-1" />
        <span class="font-bold">Les données ne seront pas enregistrées</span
        ><br />
        Vous avez connaissance d'un site qui n'est pas recensé sur la
        plateforme. Vous pouvez informer les administrateurs locaux via ce
        formulaire afin que ce site soit déclaré.
    </p>

    <PanelInfo icon="flag">
        <template v-slot:title>Qu'est-ce qu'un site ?</template>
        <template v-slot:content>
            Un site est un bidonville ou squat occupé de manière informelle à
            des fins d'habitation par plusieurs familles ou personnes, les
            services de base (eau, électricité, gestion des déchets…) y sont
            généralement absents. Tous les sites, quelles que soient l'origine
            et le nombre des personnes, peuvent être renseignés.
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
