<template>
    <CharteEngagementInput name="confidentiality_agreement">
        En validant mon accès à
        <span class="italic">Résorption-bidonvilles</span>,
        <span class="font-bold"
            >je m’engage à contribuer et à utiliser la plateforme dans une
            optique de résorption des bidonvilles selon l'approche humaine et
            pragmatique décrite par
            <Link
                to="https://www.legifrance.gouv.fr/download/pdf/circ?id=42949"
                @click="$event.stopPropagation()"
            >
                l'instruction du 25 janvier 2018
            </Link>
        </span>
        .
    </CharteEngagementInput>
</template>

<script setup>
import { Link } from "@resorptionbidonvilles/ui";
import CharteEngagementInput from "./CharteEngagementInput.vue";
</script>
