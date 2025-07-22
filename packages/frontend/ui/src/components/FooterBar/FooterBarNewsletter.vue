<template>
    <section class="max-w-md">
        <h2 class="font-bold text-lg">{{ $t('footer.newsletterTitle') }}</h2>
        <p class="text-sm">{{ $t('footer.newsletterBody') }}</p>

        <DsfrButton
            size="sm"
            icon="fr-icon-external-link-fill"
            :priority="'secondary'"
            :is-external="true"
            @click="goToNewsletter"
            >
            {{ $t('footer.newsletterCta') }}
        </DsfrButton>
    </section>
</template>

<script setup>
const newsletterLink = 'https://a757ac69.sibforms.com/serve/MUIFALVz73sp9nySQNDVaSPuG57ypOIGQrx7oMDqyu-lukbiAq1DqhoTh4UQfghOgE-jTVCzMUDQJ6CAQG5GtpsztQ3C3hPleVgcZDEEU0Y_3aPMffVdQjm_YRNdGAnjF4sET4aCQynW4QVbe1bjXnRuyTR0ETJCNgdje0QbaxOzYTKMIAPCdKNJkcYdS3Boj9Vsbj1RXYTzE_Q='
function goToNewsletter() {
  window.open(newsletterLink, '_blank')
}
</script>

<style scoped>
[target=_blank]:after {
    content: none !important;
}
</style>
