<template>
    <section class="py-20">
        <Container class="text-center">
            <h1 class="text-display-lg text-primary">
                Cette page a changé d'adresse !
            </h1>
            <p>Vous allez être redirigé(e) automatiquement...</p>
        </Container>
    </section>
</template>

<script setup>
import Container from "~/components/Layout/Container/Container.vue";

useHead({
    title: "Résorption-bidonvilles"
});

definePageMeta({
    layout: "empty"
});

if (!process.server) {
    const route = useRoute();
    const { WEBAPP_URL } = useRuntimeConfig();

    window.location.replace(`${WEBAPP_URL}${route.path}`);
}
</script>
