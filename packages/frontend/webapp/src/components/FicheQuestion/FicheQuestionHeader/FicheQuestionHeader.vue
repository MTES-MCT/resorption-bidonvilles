<template>
    <ContentWrapper>
        <ViewHeader icon="person-circle-question" direction="col">
            <template v-slot:title>
                <p>Posez vos questions,</p>
                <p>Partagez votre expertise</p>
            </template>
            <template v-slot:description>
                Ensemble, résorbons les bidonvilles
            </template>
            <template v-slot:actions>
                <Button
                    class="mx-4"
                    size="sm"
                    @click="router.push('/communaute/nouvelle-question')"
                    >Poser une question</Button
                >
                <Button
                    class="mx-4"
                    size="sm"
                    @click="router.push('/communaute')"
                    >Voir toutes les questions</Button
                >
                <Button class="mx-4" size="sm" @click="router.push('/annuaire')"
                    >Voir l'annuaire</Button
                >
            </template>
        </ViewHeader>
    </ContentWrapper>
</template>

<script setup>
import router from "@/helpers/router";

import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import { Button } from "@resorptionbidonvilles/ui";
</script>
