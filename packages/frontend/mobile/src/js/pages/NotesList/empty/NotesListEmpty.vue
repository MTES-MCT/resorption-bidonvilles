<template>
    <Container>
        <section class="mt-12 text-center">
            <NotesListPublishedEmpty v-if="currentFilter === 'published'" />
            <NotesListUnpublishedEmpty @create="$emit('create')" v-else />
        </section>
    </Container>
</template>

<script>
import Container from "#src/js/components/Container.vue";
import NotesListPublishedEmpty from "./NotesListPublishedEmpty.vue";
import NotesListUnpublishedEmpty from "./NotesListUnpublishedEmpty.vue";

export default {
    components: {
        Container,
        NotesListPublishedEmpty,
        NotesListUnpublishedEmpty,
    },

    computed: {
        currentFilter() {
            return this.$store.state.notes.filter;
        },
    },
};
</script>
