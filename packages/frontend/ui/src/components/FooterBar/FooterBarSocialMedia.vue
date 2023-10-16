<template>
    <section class="border-t mt-8 pt-6 lg:border-t-0 lg:mt-0 lg:pt-0 lg:border-l border-primary lg:pl-8 lg:pl-24">
        <h2 class="font-bold text-lg">
            {{ $t('footer.socialTitle1') }} <br class="hidden lg:inline" />{{ $t('footer.socialTitle2') }}
        </h2>
        <p class="mt-2 flex space-x-4 -ml-2">
            <FooterBarSocialMediaLink href="https://twitter.com/dihal_gouv" icon="fa-twitter"
                :socialVerb="$t('footer.socialTitle1')" :socialOn="$t('footer.socialOn')"
                :socialName="$t('footer.twitter')" />
            <FooterBarSocialMediaLink href="https://www.facebook.com/DIHAL.delegation.interministerielle/"
                icon="fa-facebook" :socialVerb="$t('footer.socialTitle1')" :socialOn="$i18n.locale === 'bg' ? $t('footer.socialOnFacebook') : $t('footer.socialOn')"
                :socialName="$t('footer.facebook')" />
            <FooterBarSocialMediaLink href="https://fr.linkedin.com/company/dihal" icon="fa-linkedin"
                :socialVerb="$t('footer.socialTitle1')" :socialOn="$t('footer.socialOn')"
                :socialName="$t('footer.linkedin')" />
        </p>
    </section>
</template>

<script setup>
import FooterBarSocialMediaLink from "./FooterBarSocialMediaLink.vue";
</script>
