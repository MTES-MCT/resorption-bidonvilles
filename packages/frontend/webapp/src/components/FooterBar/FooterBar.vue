<template>
    <footer>
        <section class="bg-blue100 py-8">
            <ContentWrapper
                class="flex flex-col lg:flex-row md:justify-between"
            >
                <FooterBarNewsletter />
                <FooterBarHotline />
                <FooterBarSocialMedia />
            </ContentWrapper>
        </section>

        <ContentWrapper class="mt-4 lg:mt-8">
            <div
                class="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between"
            >
                <IdentiteVisuelle class="-ml-3" :keepLogo="true" size="large" />
                <div class="flex space-x-3">
                    <FooterBarPartnerLink
                        href="https://www.gouvernement.fr/delegation-interministerielle-a-l-hebergement-et-a-l-acces-au-logement"
                        >DIHAL</FooterBarPartnerLink
                    >
                    <FooterBarPartnerLink href="https://beta.gouv.fr"
                        >beta.gouv.fr</FooterBarPartnerLink
                    >
                </div>
            </div>
            <div class="border-t mt-4 pt-4 pb-8 flex space-x-6 items-center">
                <FooterBarFootLink :to="`${WWW_URL}/mentions-legales`"
                    >Mentions légales</FooterBarFootLink
                >
                <span class="w-px bg-G300 mx-3 h-4"></span>
                <FooterBarFootLink
                    >Accessibilité : non conforme</FooterBarFootLink
                >
            </div>
        </ContentWrapper>
    </footer>
</template>

<script setup>
import ENV from "@/helpers/env.js";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import IdentiteVisuelle from "@/components/IdentiteVisuelle/IdentiteVisuelle.vue";
import FooterBarNewsletter from "./FooterBarNewsletter.vue";
import FooterBarHotline from "./FooterBarHotline.vue";
import FooterBarSocialMedia from "./FooterBarSocialMedia.vue";
import FooterBarFootLink from "./FooterBarFootLink.vue";
import FooterBarPartnerLink from "./FooterBarPartnerLink.vue";

const { WWW_URL } = ENV;
</script>
