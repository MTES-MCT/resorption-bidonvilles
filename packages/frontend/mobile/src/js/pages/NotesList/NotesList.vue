<template>
    <Layout>
        <Container>
            <header>
                <div class="flex justify-between">
                    <h1 class="font-bold text-lg">Liste de vos notes</h1>
                    <Button
                        icon="plus"
                        variant="primaryText"
                        @click.native="create"
                    />
                </div>
                <p class="hidden md:block">
                    Prenez des notes de vos passages sur le terrain puis
                    partagez les facilement dans les journaux des sites ou par
                    mail à vos collaborateur(ice).
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

            <section class="mt-4">
                <NotesListItem
                    class="mb-5"
                    v-for="note in notes"
                    :key="note.id"
                    :note="note"
                />
            </section>
        </Container>
    </Layout>
</template>

<script>
import Layout from "#src/js/components/Layout.vue";
import Container from "#src/js/components/Container.vue";
import { Button } from "@resorptionbidonvilles/ui";
import NotesListItem from "./NotesListItem.vue";

export default {
    components: {
        Layout,
        Container,
        Button,
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
        }
    }
};
</script>
