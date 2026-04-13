<template>
    <section id="main-content">
        <div class="flex flex-row">
            <ContentWrapper class="flex-1 bg-[#f5f5fe]">
                <div class="flex flex-col items-center justify-center h-full px-6">
                     <DsfrPicture
                        :src="carte"
                        alt="Impact des actions de résorption en France"
                        size="small"
                        
                     />
                </div>
            </ContentWrapper>
            <ContentWrapper class="flex flex-1 flex-col text-justify p-8">
                <h4>Quelle est la politique de résorption des bidonvilles ?</h4>
                <p>
                    Dans l'instruction du 25 janvier 2018, le gouvernement fixe un objectif de résorption des bidonvilles en dépassant une approche centrée sur les évacuations, au profit d'une approche globale alliant insertion sociale, respect de l'ordre public et prévention des réinstallations. La mission Résorption des bidonvilles accompagne et appuie les territoires concernés dans la mise en oeuvre de stratégies locales.
                </p>
                <a href="https://www.gouvernement.fr/action/resorption-des-bidonvilles" target="_blank" class="text-blue-600 mt-4 mb-14 inline-block place-self-center">
                    En savoir plus sur la politique de résorption des bidonvilles
                </a>
                <div class="flex flex-row gap-1 justify-evenly">
                <DsfrButton
                    label="S'inscrire à une session de prise en main"
                />
                <DsfrButton
                    secondary
                    label="Consulter le blog de la résorption"
                />
                </div>
            </ContentWrapper>
        </div>
    </section>
</template>
<script setup>
import carte from "~/assets/img/LandingPage/carte.png";
</script>