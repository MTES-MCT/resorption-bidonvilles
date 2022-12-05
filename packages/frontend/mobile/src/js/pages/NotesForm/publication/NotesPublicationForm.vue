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
                    <SearchInput
                        class="mt-4"
                        @click="openSearch"
                        :disabled="publicationIsPending"
                        :value="
                            linkedShantytown ? linkedShantytown.usename : null
                        "
                    />
                    <p
                        class="text-secondary text-center mt-4"
                        v-if="isNotePublishedOnLinkedShantytown"
                    >
                        La note a déjà été publiée sur ce site : veuillez
                        choisir un autre site
                    </p>
                    <NotesPublicationFormSubmitButton
                        class="mt-12"
                        @click="publish"
                        :loading="publicationIsPending"
                        :disabled="
                            publicationIsPending || linkedShantytown === null
                        "
                    />
                    <p
                        class="text-error text-center mt-4"
                        v-if="errorOfPublication"
                    >
                        Erreur : {{ errorOfPublication }}
                    </p>
                </template>
            </Container>
        </template>
    </BottomSlidingBlock>
</template>

<script>
import BottomSlidingBlock from "#src/js/components/BottomSlidingBlock.vue";
import Container from "#src/js/components/Container.vue";
import NotesPublicationFormLoading from "./NotesPublicationFormLoading.vue";
import SearchInput from "#src/js/components/SearchInput.vue";
import NotesPublicationFormSubmitButton from "./NotesPublicationFormSubmitButton.vue";

export default {
    components: {
        BottomSlidingBlock,
        Container,
        NotesPublicationFormLoading,
        SearchInput,
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
            errorOfPublication: null,
        };
    },

    computed: {
        linkedShantytownId() {
            return this.note.shantytown?.shantytownId || null;
        },
        linkedShantytown() {
            return this.$store.state.notes.linkedShantytown;
        },
        isNotePublishedOnLinkedShantytown() {
            if (this.linkedShantytown === null) {
                return false;
            }
            return this.note.publications.some(
                (publication) =>
                    publication.shantytown.shantytownId ===
                    this.linkedShantytown.id
            );
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
                addressSimple: result.addressSimple,
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
                    shantytown: this.linkedShantytown,
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
                this.errorOfPublication = error.message;
                this.publicationIsPending = false;
            }
        },
    },
};
</script>
