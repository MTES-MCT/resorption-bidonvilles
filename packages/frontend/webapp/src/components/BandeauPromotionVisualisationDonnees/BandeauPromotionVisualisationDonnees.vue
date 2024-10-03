<template>
    <ContentWrapper>
        <article
            class="full-width mx-auto mb-8 bg-blue200 rounded-lg overflow-hidden px-1 py-3"
        >
            <header class="flex items-center">
                <img
                    height="20"
                    class="ml-8 mr-5 mt-3 h-20"
                    :src="VisualisationImage.img"
                    :alt="VisualisationImage.text"
                />
                <div
                    class="tracking-wide text-display-md font-bold text-primary"
                >
                    <TagNouveau />
                    <br />Espace de visualisation des données
                </div>
            </header>

            <div class="shrink-0 lg:shrink py-2 lg:py-4 px-4 lg:px-8">
                <p class="text-md">
                    Vous pouvez désormais analyser la situation de votre
                    territoire et les tendances clés, les évolutions, sous la
                    forme de tableaux, graphiques et carte.
                </p>
                <p>
                    Rendez-vous dans l’onglet
                    <Link
                        withStyle
                        classes="inline-block px-2 py-1 text-white bg-primary rounded hover:bg-white transition-colors"
                        :to="navigationStore.metricsItem.route"
                        >Visualisation des données</Link
                    >
                </p>
            </div>
        </article>
    </ContentWrapper>
</template>
<script setup>
import { ContentWrapper, Link } from "@resorptionbidonvilles/ui";
import TagNouveau from "@/components/TagNouveau/TagNouveau.vue";
import { useNavigationStore } from "@/stores/navigation.store";
import imagePromotionVisualisation from "@/assets/img/illustrations/visualisation.svg";

const navigationStore = useNavigationStore();
const VisualisationImage = {
    img: imagePromotionVisualisation,
    text: "Visualisation des données Résorption-Bidonvilles",
};
</script>
