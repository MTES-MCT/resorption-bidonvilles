<template>
    <div>
        <Layout>
            <template slot="header">
                <NotesFormHeader
                    @publish="showPublish"
                    @copy="copy"
                    :disablePublish="isEmpty"
                />
            </template>
            <template slot="scroll">
                <textarea
                    class="px-6 w-full h-full outline-none"
                    ref="textarea"
                    v-model="description"
                ></textarea>
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

export default {
    components: {
        Layout,
        NotesFormHeader,
        NotesPublicationForm
    },
    async mounted() {
        setTimeout(() => {
            if (!this.isPublishOpenByDefault) {
                this.$refs.textarea.focus();
            }
        }, 100);
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
        copy() {
            this.$refs.textarea.select();
            document.execCommand("copy");
            this.$store.dispatch("notifications/add", {
                text: "Note copiée dans le presse-papier",
                icon: "copy"
            });
        },
        showPublish() {
            this.$refs.publicationForm.show();
            this.$store.commit("notes/SET_PUBLISH_FORM_IS_OPEN", true);
        },
        onPublishClose() {
            this.$nextTick(() => {
                this.$refs.textarea.focus();
            });
            this.$store.commit("notes/SET_PUBLISH_FORM_IS_OPEN", false);
        }
    }
};
</script>
