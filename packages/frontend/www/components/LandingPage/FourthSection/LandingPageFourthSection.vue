<template>
    <div>
        <p class="text-center text-display-lg font-bold text-primary mb-10">
            {{ $t("aboutUs") }}
        </p>

        <div class="max-w-screen-lg">
            <div class="mx-auto flex flex-col lg:flex-row">
                <div class="lg:w-6/12 lg:pr-6">
                    <div v-if="$i18n.locale === 'fr'">
                        <p>
                            La start-up d’État
                            <span class="font-italic">Résorption-bidonvilles</span>, lancée fin 2018, est portée par la
                            <a href="https://www.gouvernement.fr/delegation-interministerielle-a-l-hebergement-et-a-l-acces-au-logement"
                                class="link font-bold">Dihal (Délégation interministérielle à
                                l’hébergement et à l’accès au logement)</a>, administration centrale chargée notamment
                            du
                            suivi de la politique de résorption des bidonvilles.
                            Ainsi, elle est
                            <span class="font-bold">en lien direct</span> et
                            s'inscrit dans un objectif de transformation de
                            <span class="font-bold">l’action publique</span>.
                        </p>
                    </div>
                    <p v-else>
                        <span class="font-bold">
                            {{
                                $t(
                                    "landingPage.thirdSection.firstParagraph.body.text1"
                                )
                            }}
                            <span class="italic">{{
                                $t(
                                    "landingPage.thirdSection.firstParagraph.body.text2"
                                )
                            }}</span>
                            {{
                                $t(
                                    "landingPage.thirdSection.firstParagraph.body.text3"
                                )
                            }}
                        </span>
                        (<a class="link"
                            href="https://www.ecologie.gouv.fr/resorption-des-campements-illicites-et-des-bidonvilles">Dihal</a>).
                        {{
                            $t(
                                "landingPage.thirdSection.firstParagraph.body.text4"
                            )
                        }}.<br />
                        {{
                            $t(
                                "landingPage.thirdSection.firstParagraph.body.text5"
                            )
                        }}
                        <a class="link" href="https://beta.gouv.fr/startups/resorption-bidonvilles.html">{{
                            $t(
                                "landingPage.thirdSection.firstParagraph.body.link1"
                            )
                        }}.</a>
                    </p>
                </div>

                <div class="mt-10 lg:w-6/12 lg:mt-0 lg:pl-6">
                    <ul>
                        <li>
                            <span class="font-bold">Manuel Demougeot</span> :
                            {{ $t('landingPage.fourthSection.team.actorRole1') }}
                        </li>
                        <li>
                            <span class="font-bold">Jean-Paul Domalain</span> :
                            {{ $t('landingPage.fourthSection.team.actorRole3') }}
                        </li>
                        <li>
                            <span class="font-bold">Christophe Bénard et Gilles Cognin</span>
                            : {{ $t('landingPage.fourthSection.team.developers') }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const i18n = useI18n();
</script>