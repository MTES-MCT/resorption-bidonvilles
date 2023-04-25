<template>
    <ContentWrapper>
        <div
            class="full-width mx-auto mb-8 bg-yellow-200 rounded-lg overflow-hidden"
        >
            <div class="lg:flex">
                <div class="lg:flex-shrink-0 justify-center self-center">
                    <img
                        width="130"
                        class="m-4 h-20r"
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
                        Tout ce que vous voulez savoir sur les bidonvilles !
                    </div>
                    <p class="text-md">
                        Vous pouvez désormais poser toutes les questions que
                        vous souhaitez à la communauté des 1 400 utilisateurs de
                        la plateforme grâce à un nouvel espace d'entraide !
                        Rendez-vous dans l’onglet communauté !
                    </p>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>
<script setup>
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import imagePromotionEspaceEntraide from "@/assets/img/promotion_espace_entraide/promotion_espace_entraide.png";

const EspaceEntraideImage = {
    img: imagePromotionEspaceEntraide,
    text: "Espace Entraide Résorption-Bidonvilles",
};
</script>
