<template>
    <Layout>
        <div class="fr-container fr-pb-8w">
            <div class="fr-grid-row fr-grid-row--center">
                <div class="fr-col-12 fr-col-md-10 fr-col-lg-8">
                    <h1 class="fr-h1">Mentions légales</h1>

                    <h2 class="fr-h4 fr-mt-6w fr-mb-2w">Éditeurs</h2>
                    <p>
                        <RouterLink to="/">Résorption bidonvilles</RouterLink>
                        est édité par la
                        <a
                            href="https://lannuaire.service-public.gouv.fr/gouvernement/a66b3932-b91e-441b-8ecb-f4de7a01b5a8"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Délégation interministérielle à l’hébergement et à l’accès au logement (Dihal) - nouvelle fenêtre"
                            >Délégation interministérielle à l’hébergement et à
                            l’accès au logement (Dihal)</a
                        >.
                    </p>

                    <h2 class="fr-h4 fr-mt-6w fr-mb-2w">Nous joindre</h2>
                    <ul>
                        <li>Par téléphone : +33 (0) 1 40 81 98 80</li>
                        <li>
                            Par mail :
                            <a
                                href="mailto:contact-resorption-bidonvilles@dihal.gouv.fr"
                                >contact-resorption-bidonvilles@dihal.gouv.fr</a
                            >
                        </li>
                    </ul>

                    <h2 class="fr-h4 fr-mt-6w fr-mb-2w">
                        Directeurs de la publication
                    </h2>
                    <ul>
                        <li>
                            Délégué interministériel à l’hébergement et l’accès
                            au logement
                        </li>
                        <li>La Grande Arche - 92055 La Défense Cedex</li>
                    </ul>

                    <h2 class="fr-h4 fr-mt-6w fr-mb-2w">
                        Prestataire d’hébergement
                    </h2>
                    <p>
                        Le site
                        <RouterLink to="/"
                            >resorption-bidonvilles.dihal.gouv.fr</RouterLink
                        >
                        est hébergé par la société OVH :
                    </p>
                    <ul>
                        <li>Code APE 6202A</li>
                        <li>
                            N°&nbsp;TVA&nbsp;:
                            FR&nbsp;22&nbsp;424&nbsp;761&nbsp;419
                        </li>
                        <li>
                            Inscrite au RCS Roubaix – Tourcoing
                            424&nbsp;761&nbsp;419&nbsp;00045
                        </li>
                    </ul>
                    <p>
                        Siège social : 2 rue Kellermann, 59100 Roubaix, France
                    </p>

                    <h2 class="fr-h4 fr-mt-6w fr-mb-2w">Partage des données</h2>
                    <p>
                        Si vous disposez d’un accès à la plateforme, des données
                        anonymisées sont stockées pour mieux comprendre comment
                        vous naviguez et utilisez les dernières fonctionnalités
                        mises à votre disposition.
                    </p>
                    <p>
                        Ces données sont utilisées exclusivement à des fins
                        d’amélioration de l’impact et de l’utilité de la
                        plateforme et ne sont en aucun cas communiquées à des
                        tiers.
                    </p>
                    <p>
                        Vous pouvez néanmoins désactiver ce partage des données
                        ci-dessous.
                    </p>

                    <p v-if="isUserOptedOut === null" role="status">
                        Chargement de votre préférence…
                    </p>
                    <DsfrButton
                        v-else
                        type="button"
                        :label="buttonLabel"
                        @click="toggleOptOut"
                    />
                    <p role="status" class="fr-sr-only">{{ statusMessage }}</p>
                </div>
            </div>
        </div>
    </Layout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import Layout from "@/components/Layout/Layout.vue";
import { optOut, forgetOptOut, isOptedOut } from "@/helpers/matomo";

const isUserOptedOut = ref(isOptedOut());
const statusMessage = ref("");

const buttonLabel = computed(function computeButtonLabel() {
    return isUserOptedOut.value
        ? "Autoriser le partage de mes données"
        : "Ne pas autoriser le partage de mes données";
});

onMounted(function initOptOutState() {
    try {
        refreshIsOptedOut();
    } catch (error) {
        console.log(`Erreur: ${error}`);
    }
});

function toggleOptOut() {
    if (isUserOptedOut.value) {
        forgetUserOptOut();
        statusMessage.value = "Le partage de vos données est autorisé.";
    } else {
        optUserOut();
        statusMessage.value = "Le partage de vos données est désactivé.";
    }
}

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
