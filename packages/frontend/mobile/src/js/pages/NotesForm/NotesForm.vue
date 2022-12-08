<template>
    <div class="h-full">
        <Layout class="pt-4">
            <template v-slot:header>
                <NotesFormHeader
                    @publish="showPublish"
                    @copy="copy"
                    :disablePublish="isEmpty"
                    :note="note"
                />
            </template>
            <template v-slot:scroll>
                <div class="h-full overflow-hidden">
                    <textarea
                        ref="textarea"
                        :disabled="note.publications.length !== 0"
                        class="px-6 py-3 w-full h-full outline-none"
                        v-model="description"
                        placeholder="Cliquez ici pour commencer la saisie..."
                    ></textarea>
                </div>
            </template>
        </Layout>

        <NotesPublicationForm
            ref="publicationForm"
            @close="onPublishClose"
            :note="note"
            :openByDefault="isPublishOpenByDefault"
        />
    </div>
</template>

<script>
import Layout from "#src/js/components/Layout.vue";
import NotesFormHeader from "./NotesFormHeader.vue";
import NotesPublicationForm from "./publication/NotesPublicationForm.vue";
import { incrementNumberOfCopies } from "#src/js/helpers/note";

export default {
    components: {
        Layout,
        NotesFormHeader,
        NotesPublicationForm,
    },
    async mounted() {
        this.$nextTick(() => {
            if (!this.isPublishOpenByDefault) {
                this.$refs.textarea.focus();
            }
        });
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
                    description: text,
                });
            },
        },
        isEmpty() {
            return this.note.description.replace(/^\s+|\s+$/g, "") === "";
        },
        isPublishOpenByDefault() {
            return this.$store.state.notes.publishFormIsOpen;
        },
    },
    methods: {
        async copy() {
            this.$refs.textarea.select();
            document.execCommand("copy");
            await incrementNumberOfCopies(this.note.id);
            this.$store.dispatch("notifications/add", {
                text: "Note copiée dans le presse-papier",
                icon: "copy",
            });
        },
        showPublish() {
            this.$refs.publicationForm.show();
            this.$store.commit("notes/SET_PUBLISH_FORM_IS_OPEN", true);
        },
        onPublishClose() {
            this.$refs.textarea.focus();
            this.$store.commit("notes/SET_PUBLISH_FORM_IS_OPEN", false);
        },
    },
};
</script>
