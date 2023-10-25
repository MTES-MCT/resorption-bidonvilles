<template>
    <ContentWrapper>
        <article
            class="full-width mx-auto mb-8 bg-yellow-200 rounded-lg overflow-hidden px-1 py-3"
        >
            <header class="flex items-center">
                <img
                    height="20"
                    class="ml-4 h-20"
                    :src="EspaceEntraideImage.img"
                    :alt="EspaceEntraideImage.text"
                />
                <div
                    class="tracking-wide text-display-md font-bold text-primary"
                >
                    <TagNouveau />
                    <br />Tout ce que vous voulez savoir sur les bidonvilles !
                </div>
            </header>

            <div class="shrink-0 lg:shrink py-2 lg:py-4 px-4 lg:px-8">
                <p class="text-md">
                    Vous pouvez désormais poser toutes les questions que vous
                    souhaitez à la communauté des plus de 1 400 utilisateurs de
                    la plateforme grâce à
                    <Link to="/communaute">un nouvel espace d'entraide</Link>
                    !<br /><Link to="/communaute"
                        >Rendez-vous dans l’onglet entraide !</Link
                    >
                </p>
            </div>
        </article>
    </ContentWrapper>
</template>
<script setup>
import { ContentWrapper, Link } from "@resorptionbidonvilles/ui";
import TagNouveau from "@/components/TagNouveau/TagNouveau.vue";
import imagePromotionEspaceEntraide from "@/assets/img/illustrations/communaute.svg";

const EspaceEntraideImage = {
    img: imagePromotionEspaceEntraide,
    text: "Espace Entraide Résorption-Bidonvilles",
};
</script>
