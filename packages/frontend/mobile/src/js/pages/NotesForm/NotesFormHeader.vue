<template>
    <Container class="flex justify-end mb-4">
        <Button
            icon="arrow-left"
            iconPosition="left"
            size="sm"
            variant="textPrimary"
            class="text-primary"
            @click="$router.push('/liste-des-notes')"
            >Retour aux notes</Button
        >
        <Button
            icon="copy"
            iconPosition="left"
            size="sm"
            variant="textPrimary"
            class="text-primary"
            @click="$emit('copy')"
            >Copier</Button
        >
        <Button
            icon="paper-plane"
            iconPosition="left"
            size="sm"
            variant="textPrimary"
            class="text-primary"
            @click="$emit('publish')"
            :disabled="disablePublish"
            >Publier</Button
        >
    </Container>
</template>

<script>
import { Button } from "@resorptionbidonvilles/ui";
import Container from "#src/js/components/Container.vue";

export default {
    components: {
        Button,
        Container,
    },

    props: {
        disablePublish: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
};
</script>
