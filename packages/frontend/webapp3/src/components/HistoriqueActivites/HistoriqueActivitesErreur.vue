<template>
    <ViewError>
        <template v-slot:title>Liste des activités indisponible</template>
        <template v-slot:code>{{ activitiesStore.error }}</template>
        <template v-slot:content
            >Vous souhaitiez accéder à la liste des dernières activités sur la
            plateforme mais la collecte des données a échoué. Vous pouvez
            réessayer un peu plus tard ou nous contacter en cas
            d'urgence.</template
        >
        <template v-slot:actions>
            <Button
                icon="rotate-right"
                iconPosition="left"
                type="button"
                @clicked="activitiesStore.fetchDefault"
                >Réessayer</Button
            >
            <ButtonContact />
        </template>
    </ViewError>
</template>

<script setup>
import { useActivitiesStore } from "@/stores/activities.store";

import { Button } from "@resorptionbidonvilles/ui";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import ViewError from "@/components/ViewError/ViewError.vue";

const activitiesStore = useActivitiesStore();
</script>
