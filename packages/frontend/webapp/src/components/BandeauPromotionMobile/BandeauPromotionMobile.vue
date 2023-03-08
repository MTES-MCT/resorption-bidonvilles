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
                        :src="mobileImage.img"
                        :alt="mobileImage.text"
                    />
                </div>
                <div
                    class="flex-shrink-0 lg:flex-shrink py-2 lg:py-4 px-4 lg:px-8"
                >
                    <div
                        class="tracking-wide text-display-md font-bold text-primary"
                    >
                        La plateforme dans votre poche !
                    </div>
                    <p class="text-md">
                        Rendez-vous sur votre téléphone portable pour découvrir
                        la première version mobile qui vous permettra de
                        consulter la fiche d'un site, d'écrire sur le journal du
                        site et de créer des notes personnelles. Pour vous
                        connecter, utilisez la même adresse :
                        resorption-bidonvilles.beta.gouv.fr et vos identifiants
                        habituels.
                    </p>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>
<script setup>
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import imagePromotionMobile from "@/assets/img/promotion_mobile/promotion_mobile.png";

const mobileImage = {
    img: imagePromotionMobile,
    text: "Application Mobile Résorption-Bidonvilles",
};
</script>
