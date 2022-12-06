<template>
    <Layout :navbar="true">
        <template v-slot:header>
            <Container class="mt-4">
                <header class="flex items-center space-x-2 mb-3">
                    <img
                        class="h-6"
                        src="/img/marianne.svg"
                        alt="République Française"
                    />
                    <h1 class="font-bold text-lg">Résorption-bidonvilles</h1>
                </header>
            </Container>
        </template>
        <template v-slot:scroll>
            <Container class="text-center mt-8">
                <h1 class="font-bold text-lg mb-4">
                    Questionnaire de satisfaction
                </h1>
                <p>
                    Donnez votre avis sur cette première version mobile à
                    travers ce questionnaire d'une minute en 8 questions et un
                    espace de suggestion à utiliser sans modération !
                </p>
                <Button
                    @click="redirectToQuestionnary"
                    iconPosition="left"
                    class="mt-8"
                    >Donner mon avis</Button
                >
            </Container>
        </template>
    </Layout>
</template>

<script setup>
import Container from "#src/js/components/Container.vue";
import Layout from "#src/js/components/Layout.vue";
import { Button } from "@resorptionbidonvilles/ui";

function redirectToQuestionnary() {
    location.replace(
        "https://app.evalandgo.com/form/276347/s/?id=JTlBaSU5M20lOTglQUU%3D&a=JTk2cCU5N2slOUElQjA%3D"
    );
}
</script>
