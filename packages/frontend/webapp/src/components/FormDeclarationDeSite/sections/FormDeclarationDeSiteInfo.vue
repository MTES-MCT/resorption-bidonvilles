<template>
    <p v-if="mode === 'report'" class="bg-yellow-200 p-4 mb-6">
        <Icon icon="triangle-exclamation" class="mr-1" />
        <span class="font-bold">Les données ne seront pas enregistrées</span
        ><br />
        Vous avez connaissance d'un site qui n'est pas recensé sur la
        plateforme. Vous pouvez informer les administrateurs locaux via ce
        formulaire afin que ce site soit déclaré.
    </p>

    <DsfrAccordion>
        <template #title>
            <!-- <p
                class="rounded-full inline-flex items-center justify-center bg-primary text-white w-6 h-6 text-center text-xs align-middle mr-2"
            >
                <Icon icon="flag" />
            </p> -->
            <p class="font-bold">Qu'est-ce qu'un site ?</p>
        </template>
        <template v-slot:default>
            <DsfrNotice>
                Un site est un bidonville ou squat occupé de manière informelle
                à des fins d'habitation par plusieurs familles ou personnes, les
                services de base (eau, électricité, gestion des déchets…) y sont
                généralement absents. Tous les sites, quelle que soit l'origine
                et quel que soit le nombre de personnes, peuvent être
                renseignés.
            </DsfrNotice>
        </template>
    </DsfrAccordion>
</template>

<script setup>
import { toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    mode: {
        type: String,
        required: true,
    },
});
const { mode } = toRefs(props);
</script>
