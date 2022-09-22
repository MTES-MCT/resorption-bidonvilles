<template>
    <Layout>
        <template slot="header">
            <Container>
                <header>
                    <div class="flex justify-between items-center">
                        <h1 class="font-bold text-lg">Liste de vos notes</h1>
                        <Button
                            size="sm"
                            icon="plus"
                            iconPosition="left"
                            variant="primaryText"
                            @click.native="create"
                            >Créer</Button
                        >
                    </div>
                    <p class="hidden md:block">
                        Prenez des notes de vos passages sur le terrain puis
                        partagez les facilement dans les journaux des sites ou
                        par mail à vos collaborateur(ice).
                    </p>
                </header>

                <section class="mt-12 text-center" v-if="notes.length === 0">
                    <img
                        src="/img/illustrations/notes_empty.svg"
                        class="w-1/2 mx-auto max-w-lg"
                    />
                    <Button @click.native="create"
                        >Cliquez ici pour rédiger votre première note</Button
                    >
                </section>
            </Container>
        </template>

        <template slot="scroll">
            <section class="mt-4">
                <SlidingBlock class="mb-4" v-for="note in notes" :key="note.id">
                    <template slot="body">
                        <Container><NotesListItem :note="note"/></Container>
                    </template>
                    <template slot="slider">
                        <div
                            class="bg-red h-full flex justify-center items-center text-white text-xl"
                            @click="deleteNote(note.id)"
                        >
                            <Icon icon="trash-alt" />
                        </div>
                    </template>
                </SlidingBlock>
            </section>
        </template>
    </Layout>
</template>

<script>
import Layout from "#src/js/components/Layout.vue";
import Container from "#src/js/components/Container.vue";
import SlidingBlock from "#src/js/components/SlidingBlock.vue";
import { Button, Icon } from "@resorptionbidonvilles/ui";
import NotesListItem from "./NotesListItem.vue";

export default {
    components: {
        Layout,
        Container,
        SlidingBlock,
        Button,
        Icon,
        NotesListItem
    },
    computed: {
        notes() {
            return this.$store.state.notes.notes;
        }
    },
    methods: {
        create() {
            this.$store.dispatch("notes/createNote");
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
