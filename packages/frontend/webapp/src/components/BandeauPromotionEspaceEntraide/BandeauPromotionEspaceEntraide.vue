<template>
    <ContentWrapper>
        <div
            class="full-width mx-auto mb-8 bg-yellow-200 rounded-lg overflow-hidden"
        >
            <div class="lg:flex">
                <div class="lg:flex-shrink-0 justify-center self-center">
                    <img
                        height="20"
                        class="ml-4 h-20"
                        :src="EspaceEntraideImage.img"
                        :alt="EspaceEntraideImage.text"
                    />
                </div>
                <div
                    class="flex-shrink-0 lg:flex-shrink py-2 lg:py-4 px-4 lg:px-8"
                >
                    <div
                        class="tracking-wide text-display-md font-bold text-primary"
                    >
                        <TagNouveau />
                        Tout ce que vous voulez savoir sur les bidonvilles !
                    </div>
                    <p class="text-md">
                        Vous pouvez désormais poser toutes les questions que
                        vous souhaitez à la communauté des plus de 1 400
                        utilisateurs de la plateforme grâce à
                        <Link to="/communaute"
                            >un nouvel espace d'entraide</Link
                        >
                        !<br /><Link to="/communaute"
                            >Rendez-vous dans l’onglet communauté !</Link
                        >
                    </p>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>
<script setup>
import { Link } from "@resorptionbidonvilles/ui";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import TagNouveau from "@/components/TagNouveau/TagNouveau.vue";
import imagePromotionEspaceEntraide from "@/assets/img/illustrations/communaute.svg";

const EspaceEntraideImage = {
    img: imagePromotionEspaceEntraide,
    text: "Espace Entraide Résorption-Bidonvilles",
};
</script>
