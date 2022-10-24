<template>
    <LayoutError variant="interdit">
        <template v-slot:title>Accès refusé</template>
        <template v-slot:code>Votre session est expirée</template>
        <template v-slot:content
            >Votre session de connexion à la plateforme est expirée, veuillez
            vous reconnecter via le formulaire de connexion.<br />Si vous pensez
            qu'il s'agit d'une erreur, n'hésitez pas à nous contacter.</template
        >
        <template v-slot:actions>
            <Button
                icon="arrow-right"
                iconPosition="left"
                type="button"
                href="/connexion"
                >Aller au formulaire de connexion</Button
            >
            <ButtonContact />
        </template>
    </LayoutError>
</template>

<script setup>
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import { Button } from "@resorptionbidonvilles/ui";
</script>
