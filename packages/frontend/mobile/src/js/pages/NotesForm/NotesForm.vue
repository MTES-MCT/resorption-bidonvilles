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
                    <div
                        v-if="loadingLinkedShantytown"
                        class="mt-8 text-center bg-G100 py-4"
                    >
                        <Spinner /><br />
                        <span class="text-sm text-G600"
                            >Chargement des données liées aux sites</span
                        >
                    </div>
                    <template v-else>
                        <p class="mt-4 text-center">
                            <Button
                                variant="textPrimary"
                                :truncate="true"
                                class="text-primary border border-G500 rounded-lg w-full"
                                v-bind:class="{
                                    'text-G400': linkedShantytown === null
                                }"
                                icon="search"
                                iconPosition="left"
                                @click="openSearch"
                            >
                                <template v-if="linkedShantytown === null"
                                    >Saisissez le nom d'un site</template
                                >
                                <template v-else>{{
                                    linkedShantytown.usename
                                }}</template>
                            </Button>
                        </p>
                        <p class="text-center mt-12">
                            <Button
                                icon="paper-plane"
                                iconPosition="left"
                                :disabled="linkedShantytown === null"
                                @click="publish"
                                >Publier la note</Button
                            >
                        </p>
                    </template>
                </Container>
            </template>
        </BottomSlidingBlock>
    </div>
</template>

<script>
import { Button, Spinner } from "@resorptionbidonvilles/ui";
import BottomSlidingBlock from "#src/js/components/BottomSlidingBlock.vue";
import Container from "#src/js/components/Container.vue";
import Layout from "#src/js/components/Layout.vue";

export default {
    components: {
        BottomSlidingBlock,
        Button,
        Container,
        Layout,
        Spinner
    },
    async mounted() {
        this.$nextTick(() => {
            if (!this.isPublishOpenByDefault) {
                this.$refs.textarea.focus();
            }
        });

        // si un site est déjà lié à la note, on doit récupérer les infos détaillées (nom, etc.)
        if (this.shantytown !== null) {
            // si le site est détaillé est déjà dans le store, on s'arrête là
            const { linkedShantytown } = this.$store.state.notes;
            if (
                linkedShantytown !== null &&
                linkedShantytown.id === this.shantytown
            ) {
                return;
            }

            // sinon on fetch les données
            // (localement si elles existent, et sinon via l'API)
            this.$store.commit("notes/SET_LINKED_SHANTYTOWN", null);

            this.loadingLinkedShantytown = true;
            try {
                const shantytown = await this.$store.dispatch(
                    "fetchShantytown",
                    this.shantytown
                );
                this.$store.commit("notes/SET_LINKED_SHANTYTOWN", shantytown);
            } catch (error) {
                console.log(error);
            }

            this.loadingLinkedShantytown = false;
        } else {
            this.$store.commit("notes/SET_LINKED_SHANTYTOWN", null);
        }
    },
    data() {
        return {
            loadingLinkedShantytown: false
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
        },
        shantytown() {
            return this.note.shantytown;
        },
        linkedShantytown() {
            return this.$store.state.notes.linkedShantytown;
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
        },
        openSearch() {
            this.$store.commit(
                "search/SET_LISTENER",
                this.onSearch.bind(this, this.$route.params.id)
            );
            this.$router.push("/recherche-de-site");
        },
        onSearch(noteId, result) {
            this.$store.commit("notes/SET_LINKED_SHANTYTOWN", result);
            this.$store.dispatch("notes/setShantytown", {
                id: noteId,
                shantytownId: result.id
            });
        },
        async publish() {
            try {
                await this.$store.dispatch("notes/publishNote", {
                    id: this.note.id,
                    shantytown: this.note.shantytown
                });

                this.$store.commit("notes/SET_PUBLISH_FORM_IS_OPEN", false);
                this.$router.back();
            } catch (error) {
                console.log(error);
            }
        }
    }
};
</script>
