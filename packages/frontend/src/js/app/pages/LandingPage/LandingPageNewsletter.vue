<template>
    <div class="text-center max-w-screen-lg">
        <h2 class="text-display-lg text-primary">
            {{ $t("landingPage.newsletter.title") }}
        </h2>
        <div class="mb-4 max-w-screen-sm mx-auto">
            {{ $t("landingPage.newsletter.text") }}
        </div>
        <Button
            variant="primary"
            href="https://email.developpement-durable.gouv.fr/users/subscribe/js_id/5n4i/id/1"
            >{{ $t("landingPage.newsletter.cta") }}</Button
        >
        <div class="mt-6">
            <a
                class="link"
                href="https://www.gouvernement.fr/resorption-des-bidonvilles"
                >{{ $t("landingPage.newsletter.viewAll") }}</a
            >
        </div>
    </div>
</template>
