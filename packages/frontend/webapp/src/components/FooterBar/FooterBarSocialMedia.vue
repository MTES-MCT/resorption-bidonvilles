<template>
    <section
        class="border-t mt-8 pt-6 md:border-t-0 md:mt-0 md:pt-0 md:border-l border-primary md:pl-8 lg:pl-24"
    >
        <h1 class="font-bold text-lg">
            Suivez-nous <br class="hidden md:inline" />sur les réseaux sociaux
        </h1>
        <p class="mt-2 flex space-x-4 -ml-2">
            <FooterBarSocialMediaLink
                href="https://twitter.com/dihal_gouv"
                icon="fa-twitter"
            />
            <FooterBarSocialMediaLink
                href="https://www.facebook.com/DIHAL.delegation.interministerielle/"
                icon="fa-facebook"
            />
            <FooterBarSocialMediaLink
                href="https://fr.linkedin.com/company/dihal"
                icon="fa-linkedin"
            />
        </p>
    </section>
</template>

<script setup>
import FooterBarSocialMediaLink from "./FooterBarSocialMediaLink.vue";
</script>
