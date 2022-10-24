<template>
    <Layout class="pt-4">
        <template v-slot:header>
            <NotesListHeader @create="create" />
        </template>

        <template v-slot:scroll>
            <NotesListEmpty v-if="notes.length === 0" @create="create" />

            <section class="mt-4" v-else>
                <NotesListItemWrapper
                    class="mb-4"
                    v-for="note in notes"
                    :key="note.id"
                    :note="note"
                    @delete="deleteNote"
                />
            </section>
        </template>
    </Layout>
</template>

<script>
import { mapGetters } from "vuex";
import Layout from "#src/js/components/Layout.vue";
import NotesListHeader from "./header/NotesListHeader.vue";
import NotesListEmpty from "./empty/NotesListEmpty.vue";
import NotesListItemWrapper from "./item/NotesListItemWrapper.vue";

export default {
    components: {
        Layout,
        NotesListHeader,
        NotesListEmpty,
        NotesListItemWrapper
    },
    computed: {
        ...mapGetters({
            notes: "notes/filteredNotes"
        }),
        currentFilter() {
            return this.$store.state.notes.filter;
        }
    },
    methods: {
        async create() {
            const { id } = await this.$store.dispatch("notes/create");
            this.$router.push(`/notes/${id}`);
            this.$store.dispatch("notes/setupFilterBarAfterCreation");
        },
        deleteNote(noteId) {
            if (
                !confirm(
                    "Cette suppression est irréversible, voulez-vous continuer ?"
                )
            ) {
                return;
            }

            this.$store.dispatch("notes/deleteNote", noteId);
        }
    }
};
</script>
