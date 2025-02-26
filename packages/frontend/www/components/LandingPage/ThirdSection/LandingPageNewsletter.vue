<template>
    <div class="text-center max-w-screen-lg">
        <p class="text-display-lg font-bold text-primary">
            {{ $t("landingPage.newsletter.title") }}
        </p>
        <p class="mb-4 max-w-screen-sm mx-auto">
            {{ $t("landingPage.newsletter.text") }}
        </p>
        <Button variant="primary" href=" https://a757ac69.sibforms.com/serve/MUIFALVz73sp9nySQNDVaSPuG57ypOIGQrx7oMDqyu-lukbiAq1DqhoTh4UQfghOgE-jTVCzMUDQJ6CAQG5GtpsztQ3C3hPleVgcZDEEU0Y_3aPMffVdQjm_YRNdGAnjF4sET4aCQynW4QVbe1bjXnRuyTR0ETJCNgdje0QbaxOzYTKMIAPCdKNJkcYdS3Boj9Vsbj1RXYTzE_Q=">{{
            $t("landingPage.newsletter.cta") }}</Button>
    </div>
</template>

<script setup>
import { Button } from "@resorptionbidonvilles/ui";
</script>