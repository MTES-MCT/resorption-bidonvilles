<template>
    <Layout>
        <div class="mt-10 max-w-screen-lg mx-auto pb-16">
            <h2 class="text-display-lg font-bold">Mentions légales</h2>
            <h3 class="text-display-md font-bold mt-8">&Eacute;diteurs</h3>
            <div class="mt-4">
                <p>
                    <Link to="/">Résorption bidonvilles</Link>
                    est édité par la Fabrique numérique du ministère de la
                    transition écologique et solidaire et du ministère de la
                    cohésion des territoires et des relations avec les
                    collectivités territoriales, sise 1 place Carpeaux, 92800
                    Puteaux, avec l’appui de l’incubateur de services numériques
                    (beta.gouv.fr) de la direction interministérielle du
                    numérique (DINUM).
                </p>
            </div>
            <h3 class="text-display-md font-bold mt-8">Nous joindre</h3>
            <div class="mt-4">
                <ul>
                    <li>Par téléphone : +33 (0) 1 40 81 98 80</li>
                    <li>
                        Par mail :
                        <p>
                            <Link
                                class="underline"
                                to="mailto: contact-resorption-bidonvilles@dihal.gouv.fr"
                            >
                                contact-resorption-bidonvilles@dihal.gouv.fr</Link
                            >
                        </p>
                    </li>
                </ul>
            </div>
            <h3 class="text-display-md font-bold mt-8">
                Directeurs de la publication
            </h3>
            <div class="mt-4">
                <ul>
                    <li>
                        Délégué interministériel à l’hébergement et l’accès au
                        logement
                    </li>
                    <li>La Grande Arche - 92055 La Défense Cedex</li>
                </ul>
            </div>
            <h3 class="text-display-md font-bold mt-8">
                Prestataire d’hébergement
            </h3>
            <div class="mt-4">
                <p>
                    Le site
                    <Link to="/">resorption-bidonvilles.dihal.gouv.fr</Link>
                    est hébergé par la société OVH<br />Code APE 6202A<br />N°
                    TVA : FR 22 424 761 419<br />Inscrite au RCS Roubaix –
                    Tourcoing 424 761 419 00045
                </p>
                <p>Siège social : 2 rue Kellermann, 59100 Roubaix, France</p>
            </div>
            <h3 class="text-display-md font-bold mt-8">Partage des données</h3>
            <div class="mt-4">
                <p>
                    Si vous disposez d’un accès à la plateforme, des données
                    anonymisées sont stockées pour mieux comprendre comment vous
                    naviguez et utilisez les dernières fonctionnalités mises à
                    votre disposition.
                </p>

                <p class="mt-3">
                    Ces données sont utilisées exclusivement à des fins
                    d’amélioration de l’impact et de l’utilité de la plateforme
                    et ne sont en aucun cas communiquées à des tiers.
                </p>

                <p class="mt-3">
                    Vous pouvez néanmoins désactiver ce partage des données
                    ci-dessous.
                </p>

                <p v-if="isUserOptedOut === null">
                    <Spinner />
                </p>
                <p v-else-if="isUserOptedOut">
                    <Button @click="forgetUserOptOut" type="button"
                        >Autoriser le partage de mes données</Button
                    >
                </p>
                <p v-else>
                    <Button @click="optUserOut" type="button"
                        >Ne pas autoriser le partage de mes données</Button
                    >
                </p>
            </div>
        </div>
    </Layout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Layout from "@/components/Layout/Layout.vue";
import { Button, Link, Spinner } from "@resorptionbidonvilles/ui";
import { optOut, forgetOptOut, isOptedOut } from "@/helpers/matomo";

let isUserOptedOut = ref(isOptedOut());

onMounted(() => {
    try {
        refreshIsOptedOut();
    } catch (error) {
        console.log(`Erreur: ${error}`);
    }
});

function optUserOut() {
    optOut();
    refreshIsOptedOut();
}

function forgetUserOptOut() {
    forgetOptOut();
    refreshIsOptedOut();
}

function refreshIsOptedOut() {
    isUserOptedOut.value = isOptedOut();
}
</script>
