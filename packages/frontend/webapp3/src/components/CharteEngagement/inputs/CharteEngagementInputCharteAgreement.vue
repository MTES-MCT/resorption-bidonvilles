<template>
    <CharteEngagementInput name="charte_agreement">
        Je m'engage à
        <span class="font-bold">
            respecter la charte d'engagement, à exploiter les informations
            présentes sur la plateforme exclusivement pour les besoins propres
            de mon organisation ; à ne pas communiquer
        </span>
        sous aucune forme (orale, écrite, copie) à un tiers.<br />
        <br />
        <Link :to="configStore.config.version_charte_engagement.fichier">
            Consulter la charte d'engagement
        </Link>
    </CharteEngagementInput>
</template>

<script setup>
import { useConfigStore } from "@/stores/config.store";

import { Link } from "@resorptionbidonvilles/ui";
import CharteEngagementInput from "./CharteEngagementInput.vue";

const configStore = useConfigStore();
</script>
