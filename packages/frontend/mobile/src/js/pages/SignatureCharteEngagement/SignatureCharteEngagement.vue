<template>
    <Layout :navbar="false">
        <template v-slot:scroll>
            <Container class="text-center mt-12">
                <h1 class="font-bold text-lg mb-4">Accès interdit</h1>
                <p class="mb-2">
                    La version mobile de la plateforme
                    <span class="italic">Résorption-bidonvilles</span> est
                    réservée aux utilisateurs ayant signé la charte
                    d'engagement.
                </p>
                <p>
                    Pour signer la charte d'engagement, veuillez vous connecter
                    depuis la version ordinateur de la plateforme.
                </p>
            </Container>
        </template>
    </Layout>
</template>

<script>
import Container from "#src/js/components/Container.vue";
import Layout from "#src/js/components/Layout.vue";

export default {
    components: {
        Container,
        Layout
    }
};
</script>
