<template>
    <Layout hero>
        <template v-slot:hero>Vous n'êtes plus très loin...</template>

        <ContentWrapper>
            <p>
                Bonjour !<br />Vous souhaitiez agir pour la résorption des
                bidonvilles mais il semblerait que vous ayez saisi ou suivi un
                lien vers une page qui n'existe pas.
            </p>
            <p class="mt-6">
                Vous êtes bien sur la plateforme
                <Link to="/"
                    ><em class="italic">Résorption-bidonvilles</em></Link
                >, alors voici quelques pages qui pourraient vous intéresser :
            </p>
            <ul class="mt-6 ml-5 list-disc">
                <li>
                    <Link :to="WWW_URL">la page d'accueil</Link> qui présente
                    notre travail
                </li>
                <li>
                    <Link to="/stats">quelques statistiques</Link>
                    sur notre mesure d'impact
                </li>
            </ul>
            <p class="mt-6">
                Et si vous ne trouvez vraiment pas ce que vous cherchez, vous
                pouvez aussi
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

const { WWW_URL, CONTACT_EMAIL } = ENV;
</script>
