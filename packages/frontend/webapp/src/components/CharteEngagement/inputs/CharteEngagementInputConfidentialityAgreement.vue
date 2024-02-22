<template>
    <CharteEngagementInput name="confidentiality_agreement" :label="label">
        <Link
            to="https://www.legifrance.gouv.fr/download/pdf/circ?id=42949"
            @click="$event.stopPropagation()"
            class="mt-4"
        >
            l'instruction du 25 janvier 2018
        </Link>
    </CharteEngagementInput>
</template>

<script setup>
const label = `En validant mon accès à Résorption-bidonvilles, je m'engage à contribuer et à utiliser la plateforme dans une optique de résorption des bidonvilles selon l'approche humaine et pragmatique décrite par`;
import { Link } from "@resorptionbidonvilles/ui";
import CharteEngagementInput from "./CharteEngagementInput.vue";
</script>
