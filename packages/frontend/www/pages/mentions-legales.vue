<template>
    <Container>
        <div class="mt-10 max-w-screen-lg mx-auto pb-16">
            <h2 class="text-display-lg font-bold">
                Mentions légales
            </h2>
            <h3 class="text-display-md font-bold mt-8">
                &Eacute;diteurs
            </h3>
            <div class=" mt-4">
                <p>
                    <Link to="/">Résorption bidonvilles</Link>
                    est édité par la Fabrique numérique du ministère de la
                    transition écologique et solidaire et du ministère de la
                    cohésion des territoires et des relations avec les
                    collectivités territoriales, sise 1 place Carpeaux,
                    92800 Puteaux, avec l’appui de l’incubateur de services
                    numériques (beta.gouv.fr) de la direction
                    interministérielle du numérique (DINUM).
                </p>
            </div>
            <h3 class="text-display-md font-bold mt-8">
                Nous joindre
            </h3>
            <div class=" mt-4">
                <ul>
                    <li>Par téléphone : +33 (0) 1 40 81 33 60</li>
                    <li>
                        Par mail :
                        <h4>
                            <Link
                                class="underline"
                                to="mailto:contact@resorption-bidonvilles.beta.gouv.fr"
                                >contact@resorption-bidonvilles.beta.gouv.fr</Link>
                        </h4>
                    </li>
                </ul>
            </div>
            <h3 class="text-display-md font-bold mt-8">
                Directeurs de la publication
            </h3>
            <div class=" mt-4">
                <ul>
                    <li>
                        Délégué interministériel à l’hébergement et l’accès
                        au logement
                    </li>
                    <li>La Grande Arche - 92055 La Défense Cedex</li>
                </ul>
            </div>
            <h3 class="text-display-md font-bold mt-8">
                Prestataire d’hébergement
            </h3>
            <div class=" mt-4">
                <p>
                    Le site
                    <Link to="/"
                        >resorption-bidonvilles.beta.gouv.fr</Link
                    >
                    est hébergé par la société OVH<br />Code APE 6202A<br />N°
                    TVA : FR 22 424 761 419<br />Inscrite au RCS Roubaix –
                    Tourcoing 424 761 419 00045
                </p>
                <p>
                    Siège social : 2 rue Kellermann, 59100 Roubaix, France
                </p>
            </div>
        </div>
    </Container>
</template>

<script setup>
import Container from "~/components/Layout/Container/Container.vue";
import { Link } from "@resorptionbidonvilles/ui";

useHead({
    title: "Mentions légales — Résorption-bidonvilles"
});

definePageMeta({
    layout: "default"
});
</script> 