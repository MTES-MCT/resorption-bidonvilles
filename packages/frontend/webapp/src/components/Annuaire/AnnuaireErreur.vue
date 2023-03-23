<template>
    <ViewError>
        <template v-slot:title>Annuaire indisponible</template>
        <template v-slot:code>{{ directoryStore.error }}</template>
        <template v-slot:content
            >Vous souhaitiez accéder à l'annuaire des acteurs de la résorption
            des bidonvilles mais la collecte des données a échoué. Vous pouvez
            réessayer un peu plus tard ou nous contacter en cas
            d'urgence.</template
        >
        <template v-slot:actions>
            <Button
                icon="rotate-right"
                iconPosition="left"
                type="button"
                @clicked="directoryStore.fetchDirectory"
                >Réessayer</Button
            >
            <ButtonContact />
        </template>
    </ViewError>
</template>

<script setup>
import { useDirectoryStore } from "@/stores/directory.store";

import { Button } from "@resorptionbidonvilles/ui";
import ViewError from "@/components/ViewError/ViewError.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";

const directoryStore = useDirectoryStore();
</script>
