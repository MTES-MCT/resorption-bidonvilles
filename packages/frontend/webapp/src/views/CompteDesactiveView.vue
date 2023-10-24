<template>
    <Layout hero>
        <template v-slot:hero>Merci.</template>

        <ContentWrapper>
            <p>
                Votre accès à
                <Link to="/"
                    ><em class="italic">Résorption-bidonvilles</em></Link
                >
                est désormais désactivé et vous avez été automatiquement
                déconnecté(e).
            </p>
            <p class="mt-6">
                Si vous souhaitez réactiver votre accès, n'hésitez pas à
                <Link :to="`mailto:${CONTACT_EMAIL}`">nous contacter !</Link>
            </p>
            <p class="mt-8">
                <Link
                    to="https://beta.gouv.fr/startups/resorption-bidonvilles.html#equipe"
                    >— L'équipe de
                    <em class="italic">Résorption-bidonvilles</em></Link
                >
            </p>
        </ContentWrapper>
    </Layout>
</template>

<script setup>
import ENV from "@/helpers/env.js";
import Layout from "@/components/Layout/Layout.vue";
import { ContentWrapper, Link } from "@resorptionbidonvilles/ui";

const { CONTACT_EMAIL } = ENV;
</script>
