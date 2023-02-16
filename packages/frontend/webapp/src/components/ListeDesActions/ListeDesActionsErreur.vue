<template>
    <ViewError>
        <template v-slot:title>Liste des actions indisponible</template>
        <template v-slot:code>{{ actionsStore.error }}</template>
        <template v-slot:content
            >Vous souhaitiez accéder à la liste des actions mais la collecte des
            données a échoué. Vous pouvez réessayer un peu plus tard ou nous
            contacter en cas d'urgence.</template
        >
        <template v-slot:actions>
            <Button
                icon="rotate-right"
                iconPosition="left"
                type="button"
                @clicked="actionsStore.fetchActions"
                >Réessayer</Button
            >
            <ButtonContact />
        </template>
    </ViewError>
</template>

<script setup>
import { Button } from "@resorptionbidonvilles/ui";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import ViewError from "@/components/ViewError/ViewError.vue";
import { useActionsStore } from "@/stores/actions.store";
const actionsStore = useActionsStore();
</script>
