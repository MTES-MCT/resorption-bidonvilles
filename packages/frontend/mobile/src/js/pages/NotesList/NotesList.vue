<template>
    <Layout>
        <template v-slot:header>
            <NotesListHeader @create="create" />
        </template>

        <template v-slot:scroll>
            <Container v-if="notes.length === 0">
                <section class="mt-12 text-center">
                    <template v-if="currentFilter === 'published'">
                        <p class="text-G700 italic">
                            Vous n'avez publié aucune de vos notes dans un
                            journal de site pour le moment.
                        </p>
                    </template>
                    <template v-else>
                        <img
                            src="/img/illustrations/notes_empty.svg"
                            class="w-1/2 mx-auto max-w-lg"
                        />
                        <Button @click.native="create"
                            ><template
                                v-if="$store.state.notes.notes.length === 0"
                                >Cliquez ici pour rédiger votre première
                                note</template
                            ><template v-else
                                >Cliquez ici pour rédiger une nouvelle
                                note</template
                            ></Button
                        >
                    </template>
                </section>
            </Container>
            <section class="mt-4" v-else>
                <LeftSlidingBlock
                    class="mb-4"
                    v-for="note in notes"
                    :key="note.id"
                >
                    <template slot="body">
                        <Container
                            @click.native="$router.push(`/notes/${note.id}`)"
                            ><NotesListItem :note="note"
                        /></Container>
                    </template>
                    <template slot="slider">
                        <div
                            class="bg-red h-full flex justify-center items-center text-white text-xl"
                            @click="deleteNote(note.id)"
                        >
                            <Icon icon="trash-alt" />
                        </div>
                    </template>
                </LeftSlidingBlock>
            </section>
        </template>
    </Layout>
</template>

<script>
import Layout from "#src/js/components/Layout.vue";
import Container from "#src/js/components/Container.vue";
import LeftSlidingBlock from "#src/js/components/LeftSlidingBlock.vue";
import { Button, Icon } from "@resorptionbidonvilles/ui";
import NotesListItem from "./NotesListItem.vue";
import NotesListHeader from "./header/NotesListHeader.vue";
import { mapGetters } from "vuex";

export default {
    components: {
        Layout,
        Container,
        LeftSlidingBlock,
        Button,
        Icon,
        NotesListItem,
        NotesListHeader
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
            const { id } = await this.$store.dispatch("notes/createNote");
            this.$router.push(`/notes/${id}`);
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
