<template>
    <ContentWrapper>
        <article
            class="full-width mx-auto mb-8 bg-yellow-200 rounded-lg overflow-hidden px-1 py-3"
        >
            <header class="flex items-center">
                <img
                    height="80"
                    class="ml-4 mr-4 mt-3 h-20"
                    :src="VisualisationImage.img"
                    :alt="VisualisationImage.text"
                />
                <div class="tracking-wide text-display-md font-bold text-black">
                    <TagNouveau />
                    <br />{{ VisualisationImage.text }}
                </div>
            </header>

            <div class="shrink-0 lg:shrink py-2 lg:py-4 px-4 lg:px-8">
                <p class="text-md mb-4">
                    L'adresse de la plateforme
                    <span class="font-bold">RESORPTION-BIDONVILLES</span> a
                    changé. Nous vous invitons à mettre à jour vos favoris et à
                    vous connecter à la nouvelle adresse:
                </p>
                <p>
                    <Link to="https://resorption-bidonvilles.dihal.gouv.fr"
                        >https://resorption-bidonvilles.dihal.gouv.fr</Link
                    >
                </p>
            </div>
        </article>
    </ContentWrapper>
</template>
<script setup>
import imageChangementUrl from "@/assets/img/illustrations/undraw_travel_mode.svg";
import TagNouveau from "@/components/TagNouveau/TagNouveau.vue";
import { ContentWrapper, Link } from "@resorptionbidonvilles/ui";

const VisualisationImage = {
    img: imageChangementUrl,
    text: "Résorption-Bidonvilles change d'adresse !",
};
</script>
