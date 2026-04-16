<template>
    <section id="main-content" class="fr-container width-inherit">
        <div class="flex flex-col lg:flex-row">
            <ContentWrapper class="flex-1">
                <div class="flex flex-col items-center justify-center justify-items-center h-full md:px-6">
                     <DsfrPicture
                        :src="carte"
                        alt="Impact des actions de résorption en France"
                        size="medium"
                        legend="Impact des actions de résorption en France"
                        title="Impact des actions de résorption en France"
                     />
                </div>
            </ContentWrapper>
            <ContentWrapper class="flex-1">
                <div class="flex flex-col text-justify md:p-8">
                    <h4>Quelle est la politique de résorption des bidonvilles&nbsp;?</h4>
                    <p>
                        Dans l'instruction du 25 janvier 2018, le gouvernement fixe un objectif de résorption des bidonvilles en dépassant une approche centrée sur les évacuations, au profit d'une approche globale alliant insertion sociale, respect de l'ordre public et prévention des réinstallations.
                    </p>
                    <p>
                        La mission Résorption des bidonvilles accompagne et appuie les territoires concernés dans la mise en oeuvre de stratégies locales.
                    </p>
                    <a href="https://www.info.gouv.fr/organisation/delegation-interministerielle-a-l-hebergement-et-a-l-acces-au-logement/resorber-durablement-les-bidonvilles" target="_blank" class="text-blue-600 mt-4 mb-10 inline-block place-self-center">
                        En savoir plus sur la politique de résorption des bidonvilles
                    </a>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
const { WEBAPP_URL, FORMATION_URL } = useRuntimeConfig().public;

const buttonHandler = (to, target = '_self') => {
    window.open(to, target);
}
</script>