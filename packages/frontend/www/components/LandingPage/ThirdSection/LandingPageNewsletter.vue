<template>
    <div class="text-center max-w-screen-lg">
        <p class="text-display-lg font-bold text-primary">
            {{ $t("landingPage.newsletter.title") }}
        </p>
        <p class="mb-4 max-w-screen-sm mx-auto">
            {{ $t("landingPage.newsletter.text") }}
        </p>
        <Button variant="primary" href="https://email.developpement-durable.gouv.fr/users/subscribe/js_id/5n4i/id/3">{{
            $t("landingPage.newsletter.cta") }}</Button>
        <p class="mt-6">
            <a class="link" href="https://www.gouvernement.fr/resorption-des-bidonvilles">{{
                $t("landingPage.newsletter.viewAll") }}</a>
        </p>
    </div>
</template>

<script setup>
import { Button } from "@resorptionbidonvilles/ui";
</script>