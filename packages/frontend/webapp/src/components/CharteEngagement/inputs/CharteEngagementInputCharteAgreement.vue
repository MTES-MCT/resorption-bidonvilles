<template>
    <CharteEngagementInput
        name="charte_agreement"
        label="Je m'engage à respecter la charte d'engagement, à exploiter les informations présentes sur la plateforme exclusivement pour les besoins propres de mon organisation ; à ne pas communiquer sous aucune forme (orale, écrite, copie) à un tiers. J’accepte la publication de mes coordonnées dans l’annuaire pour faciliter la coordination entre acteurs."
    >
        <Link
            :to="configStore.config.version_charte_engagement.fichier"
            class="mt-4"
        >
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
