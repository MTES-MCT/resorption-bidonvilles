<template>
    <section class="max-w-md">
        <h2 class="font-bold text-lg">{{ $t('footer.newsletterTitle') }}</h2>
        <p class="text-sm">{{ $t('footer.newsletterBody') }}</p>

        <Button href="https://a757ac69.sibforms.com/serve/MUIFALVz73sp9nySQNDVaSPuG57ypOIGQrx7oMDqyu-lukbiAq1DqhoTh4UQfghOgE-jTVCzMUDQJ6CAQG5GtpsztQ3C3hPleVgcZDEEU0Y_3aPMffVdQjm_YRNdGAnjF4sET4aCQynW4QVbe1bjXnRuyTR0ETJCNgdje0QbaxOzYTKMIAPCdKNJkcYdS3Boj9Vsbj1RXYTzE_Q=" class="mt-3 hover:!bg-primaryDark" size="sm"
            icon="arrow-up-right-from-square">{{ $t('footer.newsletterCta') }}</Button>
    </section>
</template>

<script setup>
import Button from "../Button.vue";
</script>
