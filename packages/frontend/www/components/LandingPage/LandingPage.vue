<template>
    <section id="main-content" class="fr-container width-inherit">
        <div class="flex flex-col lg:flex-row">
            <ContentWrapper class="flex-1">
                <div class="flex flex-col items-center justify-center justify-items-center h-full md:px-6">
                    <DsfrPicture
                        :src="bandeau"
                        alt="Photographies prises sur des bidonvilles"
                        size="medium"
                        legend="Crédits: Diego Inglez de Souza et Ville de Strasbourg"
                        title="Photographies prises sur des bidonvilles"
                        ratio="16x9"
                    />
                     <DsfrPicture
                        :src="carte"
                        alt="Impact des actions de résorption en France"
                        size="medium"
                        legend="Carte: Délégation interministérielle à l'hébergement et à l'accès au logement (DIHAL). Source: Plateforme Résorption-bidonvilles"
                        title="Impact des actions de résorption en France"
                        ratio="1x1"
                     />
                </div>
            </ContentWrapper>
            <ContentWrapper class="flex-1">
                <div class="flex flex-col text-justify md:p-8">
                    <h4>La politique de résorption des bidonvilles</h4>
                    <p>
                        Vivre dans un bidonville signifie faire face à des conditions de vie très précaires : habitat insalubre, accès limité à l’eau, à l’électricité, aux soins, à la scolarisation ou à l’emploi. Pour répondre à ces situations, l’État met en œuvre une politique de résorption des bidonvilles destinée à accompagner les personnes concernées vers des solutions durables d’hébergement, de logement et d'insertion.
                    </p>
                    <p>
                        Depuis l’instruction du 25 janvier 2018, le Gouvernement poursuit l’objectif de réduire durablement le nombre de bidonvilles et d’apporter à leurs habitants des solutions pragmatiques favorisant leur insertion vers le droit commun.
                    </p>
                    <a href="https://www.info.gouv.fr/organisation/delegation-interministerielle-a-l-hebergement-et-a-l-acces-au-logement/resorber-durablement-les-bidonvilles" target="_blank" class="text-blue-600 mt-4 mb-10 inline-block place-self-center">
                        En savoir plus sur info.gouv
                    </a>
                    <p>
                        La mission Résorption des bidonvilles accompagne les territoires concernés dans la mise en œuvre de stratégies locales adaptées à leurs réalités. Elle pilote également l’enveloppe nationale de crédits dédiée à cette politique publique, afin de soutenir chaque année les actions menées sur le terrain et d’apporter un appui technique aux acteurs locaux.
                    </p>
                    <a :href="BLOG_URL" target="_blank" class="text-blue-600 mt-4 mb-10 inline-block place-self-center">
                        En savoir plus sur notre Blog
                    </a>
                    <h4>L’outil numérique Résorption-bidonvilles au service de l’action publique</h4>
                    <p>
                        Afin de soutenir la mise en œuvre des stratégies territoriales, l’outil numérique Résorption-bidonvilles constitue un appui opérationnel au pilotage local et national de la politique publique. Il vise à renforcer la coordination entre les acteurs, fiabiliser la connaissance des situations et améliorer le suivi des actions engagées.
                    </p>
                    <div class="flex flex-col md:flex-row gap-2 md:gap-2 items-center justify-center mt-4">
                        <DsfrButtonGroup
                            inlineLayoutWhen="never"
                            :buttons="[
                                {
                                    label: 'Demander un accès à la plateforme',
                                    title: 'Demander un accès à la plateforme',
                                    onClick: buttonHandler.bind(null, `${WEBAPP_URL}/contact?language=fr&acces`)
                                }, {
                                    label: 'S\'inscrire à une session de prise en main',
                                    title: 'S\'inscrire à une session de prise en main - Ouverture dans une nouvelle fenêtre',
                                    secondary: true,
                                    onClick: buttonHandler.bind(null, FORMATION_URL, '_blank'),
                                    target: '_blank'
                                }
                            ]"
                        />
                    </div>
                </div>
            </ContentWrapper>
        </div>
    </section>
</template>
<script setup>
import carte from "~/assets/img/LandingPage/carte.png";
import bandeau from "~/assets/img/LandingPage/resorption-bidonvilles.png";
const { WEBAPP_URL, FORMATION_URL, BLOG_URL } = useRuntimeConfig().public;

const buttonHandler = (to, target = '_self') => {
    window.open(to, target);
}
</script>