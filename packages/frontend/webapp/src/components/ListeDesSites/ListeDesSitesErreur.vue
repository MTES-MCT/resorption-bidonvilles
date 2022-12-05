<template>
    <ViewError>
        <template v-slot:title>Liste des sites indisponible</template>
        <template v-slot:code>{{ townsStore.error }}</template>
        <template v-slot:content
            >Vous souhaitiez accéder à la liste des sites mais la collecte des
            données a échoué. Vous pouvez réessayer un peu plus tard ou nous
            contacter en cas d'urgence.</template
        >
        <template v-slot:actions>
            <Button
                icon="rotate-right"
                iconPosition="left"
                type="button"
                @clicked="townsStore.fetchTowns"
                >Réessayer</Button
            >
            <ButtonContact />
        </template>
    </ViewError>
</template>

<script setup>
import { useTownsStore } from "@/stores/towns.store";

import { Button } from "@resorptionbidonvilles/ui";
import ViewError from "@/components/ViewError/ViewError.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";

const townsStore = useTownsStore();
</script>
