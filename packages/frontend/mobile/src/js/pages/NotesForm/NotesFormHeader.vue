<template>
    <Container>
        <div class="flex justify-end">
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
        </div>
        <div class="my-2" v-if="note.publications.length > 0">
            <p class="text-secondary mb-2 px-2">
                Il est impossible de modifier cette note car elle a déjà été
                publiée. Vous pouvez cependant la publier à nouveau sur un autre
                site
            </p>
            <Button
                :icon="showTowns ? 'chevron-up' : 'chevron-down'"
                iconPosition="right"
                size="sm"
                variant="textPrimary"
                class="text-primary"
                @click="showTowns = !showTowns"
                >Voir les sites où la note est publiée</Button
            >
            <section v-if="showTowns">
                <li
                    v-for="publication in note.publications"
                    :key="publication.shantytown"
                    class="text-primary ml-6"
                    @click="
                        $router.push(
                            `/site/${publication.shantytown.shantytownId}`
                        )
                    "
                >
                    {{ publication.shantytown.addressSimple }}
                </li>
            </section>
        </div>
    </Container>
</template>

<script>
import { Button } from "@resorptionbidonvilles/ui";
import Container from "#src/js/components/Container.vue";

export default {
    components: {
        // eslint-disable-next-line vue/no-reserved-component-names
        Button,
        Container,
    },

    props: {
        disablePublish: {
            type: Boolean,
            required: false,
            default: true,
        },
        note: {
            type: Object,
        },
    },
    data() {
        return {
            showTowns: false,
        };
    },
};
</script>
