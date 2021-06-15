<template>
    <div class="text-center mt-40 max-w-screen-lg">
        <h2 class="text-display-lg text-primary">
            {{ $t("landingPage.newsletter.title") }}
        </h2>
        <div class="mb-4">
            {{ $t("landingPage.newsletter.text") }}
        </div>
        <Button
            variant="primary"
            class="py-2 px-4"
            href="https://email.developpement-durable.gouv.fr/users/subscribe/js_id/5n4i/id/1"
            >{{ $t("landingPage.newsletter.cta") }}</Button
        >
    </div>
</template>
