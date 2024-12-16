<template>
    <section class="max-w-md">
        <h2 class="font-bold text-lg">{{ $t('footer.newsletterTitle') }}</h2>
        <p class="text-sm">{{ $t('footer.newsletterBody') }}</p>

        <Button href="https://email.developpement-durable.gouv.fr/users/subscribe/js_id/5n4i/id/3" class="mt-3 hover:!bg-primaryDark" size="sm"
            icon="arrow-up-right-from-square">{{ $t('footer.newsletterCta') }}</Button>
    </section>
</template>

<script setup>
import Button from "../Button.vue";
</script>
