<template>
    <div>
        <Layout>
            <template slot="header">
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
                        icon="paper-plane"
                        iconPosition="left"
                        size="sm"
                        variant="textPrimary"
                        class="text-primary"
                        @click="showPublish"
                        :disabled="isEmpty"
                        >Publier</Button
                    >
                </Container>
            </template>
            <template slot="scroll">
                <textarea
                    class="px-6 w-full h-full outline-none"
                    ref="textarea"
                    v-model="description"
                ></textarea>
            </template>
        </Layout>
        <BottomSlidingBlock
            ref="publishBlock"
            @cancel="onPublishClose"
            :openByDefault="isPublishOpenByDefault"
        >
            <template slot="header">Publier ma note</template>
            <template slot="body">
                <img
                    src="/img/illustrations/notes_publish.svg"
                    class="mt-4 w-1/2 m-auto"
                />
                <Container>
                    <p class="mt-12 text-center">
                        Veuillez sélectionner le site sur lequel vous souhaitez
                        publier cette note.<br />Elle sera visible dans le
                        journal du site.
                    </p>
                    <p class="mt-4 text-center">
                        <Button
                            variant="textPrimary"
                            class="text-G400 border border-G500 rounded-lg"
                            icon="search"
                            iconPosition="left"
                            @click="$router.push('/recherche-de-site')"
                            >Saisissez le nom d'un site</Button
                        >
                    </p>
                    <p class="text-center mt-12">
                        <Button
                            icon="paper-plane"
                            iconPosition="left"
                            :disabled="shantytown === null"
                            >Publier la note</Button
                        >
                    </p>
                </Container>
            </template>
        </BottomSlidingBlock>
    </div>
</template>

<script>
import { Button } from "@resorptionbidonvilles/ui";
import BottomSlidingBlock from "#src/js/components/BottomSlidingBlock.vue";
import Container from "#src/js/components/Container.vue";
import Layout from "#src/js/components/Layout.vue";

export default {
    components: {
        BottomSlidingBlock,
        Button,
        Container,
        Layout
    },
    mounted() {
        this.$refs.textarea.focus();
    },
    data() {
        const note = this.$store.state.notes.notes.find(
            ({ id }) => id === this.$route.params.id
        );

        return {
            shantytown: note.shantytown
        };
    },
    computed: {
        note() {
            return this.$store.state.notes.notes.find(
                ({ id }) => id === this.$route.params.id
            );
        },
        description: {
            get() {
                return this.note.description;
            },
            async set(text) {
                await this.$store.dispatch("notes/setDescription", {
                    id: this.$route.params.id,
                    description: text
                });
            }
        },
        isEmpty() {
            return this.note.description.replace(/^\s+|\s+$/g, "") === "";
        },
        isPublishOpenByDefault() {
            return this.$store.state.notes.publishFormIsOpen;
        }
    },
    methods: {
        showPublish() {
            this.$refs.publishBlock.show();
            this.$store.commit("notes/SET_PUBLISH_FORM_IS_OPEN", true);
        },
        onPublishClose() {
            this.$refs.textarea.focus();
            this.$store.commit("notes/SET_PUBLISH_FORM_IS_OPEN", false);
        }
    }
};
</script>
