<template>
    <BottomSlidingBlock
        ref="slidingBlock"
        @cancel="$emit('close')"
        :openByDefault="openByDefault"
    >
        <template v-slot:header>Publier ma note</template>
        <template v-slot:body>
            <img
                src="/img/illustrations/notes_publish.svg"
                class="mt-4 w-1/2 m-auto"
            />
            <Container>
                <p class="mt-12 text-center">
                    Veuillez sélectionner le site sur lequel vous souhaitez
                    publier cette note.<br />Elle sera visible dans le journal
                    du site.
                </p>

                <NotesPublicationFormLoading v-if="loadingLinkedShantytown" />
                <template v-else>
                    <NotesPublicationFormInput
                        class="mt-4"
                        @click="openSearch"
                        :disabled="publicationIsPending"
                        :value="
                            linkedShantytown ? linkedShantytown.usename : null
                        "
                    />
                    <NotesPublicationFormSubmitButton
                        class="mt-12"
                        @click="publish"
                        :loading="publicationIsPending"
                        :disabled="
                            publicationIsPending || linkedShantytown === null
                        "
                    />
                </template>
            </Container>
        </template>
    </BottomSlidingBlock>
</template>

<script>
import BottomSlidingBlock from "#src/js/components/BottomSlidingBlock.vue";
import Container from "#src/js/components/Container.vue";
import NotesPublicationFormLoading from "./NotesPublicationFormLoading.vue";
import NotesPublicationFormInput from "./NotesPublicationFormInput.vue";
import NotesPublicationFormSubmitButton from "./NotesPublicationFormSubmitButton.vue";

export default {
    components: {
        BottomSlidingBlock,
        Container,
        NotesPublicationFormLoading,
        NotesPublicationFormInput,
        NotesPublicationFormSubmitButton,
    },

    props: {
        note: {
            type: Object,
            required: true,
        },
        openByDefault: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    data() {
        return {
            loadingLinkedShantytown: false,
            publicationIsPending: false,
        };
    },

    computed: {
        linkedShantytownId() {
            return this.note.shantytown;
        },
        linkedShantytown() {
            return this.$store.state.notes.linkedShantytown;
        },
    },

    mounted() {
        if (this.linkedShantytownId === null) {
            this.$store.commit("notes/SET_LINKED_SHANTYTOWN", null);
            return;
        }

        this.fetchLinkedShantytown();
    },

    methods: {
        show() {
            this.$refs.slidingBlock.show();
        },

        async fetchLinkedShantytown() {
            // on vérifie que ce n'est pas déjà fait
            const { linkedShantytown } = this.$store.state.notes;
            if (
                linkedShantytown !== null &&
                linkedShantytown.id === this.linkedShantytownId
            ) {
                return;
            }

            // on fetch les données
            // (localement si elles existent, et sinon via l'API)
            this.$store.commit("notes/SET_LINKED_SHANTYTOWN", null);

            this.loadingLinkedShantytown = true;
            try {
                const shantytown = await this.$store.dispatch(
                    "fetchShantytown",
                    this.linkedShantytownId
                );
                this.$store.commit("notes/SET_LINKED_SHANTYTOWN", shantytown);
            } catch (error) {
                // ignore
            }

            this.loadingLinkedShantytown = false;
        },

        openSearch() {
            if (this.publicationIsPending === true) {
                return;
            }

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
                shantytownId: result.id,
            });
        },

        async publish() {
            if (this.publicationIsPending === true) {
                return;
            }

            this.publicationIsPending = true;

            try {
                await this.$store.dispatch("notes/publishNote", {
                    id: this.note.id,
                    shantytown: this.note.shantytown,
                });
                this.$store.dispatch("notifications/add", {
                    text: "Note publiée dans le journal du site",
                    icon: "paper-plane",
                });
                this.$store.commit("notes/SET_FILTER", "published");
                this.$store.commit("notes/SET_FILTER_BAR_IS_OPEN", true);
                this.$store.commit("notes/SET_PUBLISH_FORM_IS_OPEN", false);
                this.publicationIsPending = false;
                this.$router.back();
            } catch (error) {
                this.publicationIsPending = false;
            }
        },
    },
};
</script>
