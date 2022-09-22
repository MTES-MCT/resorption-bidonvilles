<template>
    <Layout>
        <template slot="header">
            <Container>
                <header>
                    <div class="flex justify-between items-center">
                        <h1 class="font-bold text-lg">Liste de vos notes</h1>
                        <div>
                            <Button
                                size="sm"
                                icon="filter"
                                iconPosition="left"
                                variant="primaryText"
                                @click.native="toggleFilters"
                                >Filtrer</Button
                            >
                            <Button
                                size="sm"
                                icon="plus"
                                iconPosition="left"
                                variant="primaryText"
                                @click.native="create"
                                >Créer</Button
                            >
                        </div>
                    </div>
                </header>
            </Container>

            <div
                class="bg-G300 mt-3 h-0 overflow-hidden"
                id="filters"
                ref="filters"
            >
                <div class="flex justify-between text-center text-sm">
                    <div
                        class="flex-1 py-2"
                        v-for="filter in filters"
                        v-bind:class="{
                            'bg-primary text-white':
                                filter.key === currentFilter
                        }"
                        :key="filter.key"
                        @click="setFilter(filter.key)"
                    >
                        {{ filter.label }}
                    </div>
                </div>
            </div>

            <Container>
                <p class="hidden md:block">
                    Prenez des notes de vos passages sur le terrain puis
                    partagez les facilement dans les journaux des sites ou par
                    mail à vos collaborateur(ice).
                </p>

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

<style scoped>
#filters {
    transition: height 0.5s 0s ease-in-out;
}
</style>

<script>
import Layout from "#src/js/components/Layout.vue";
import Container from "#src/js/components/Container.vue";
import SlidingBlock from "#src/js/components/SlidingBlock.vue";
import { Button, Icon } from "@resorptionbidonvilles/ui";
import NotesListItem from "./NotesListItem.vue";
import { mapGetters } from "vuex";

export default {
    components: {
        Layout,
        Container,
        SlidingBlock,
        Button,
        Icon,
        NotesListItem
    },
    data() {
        return {
            filters: [
                { key: "all", label: "Toutes" },
                { key: "unpublished", label: "Non publiées" },
                { key: "published", label: "Publiées" }
            ],
            filterIsVisible: false
        };
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
        },
        toggleFilters() {
            this.filterIsVisible = !this.filterIsVisible;
            if (this.filterIsVisible) {
                this.$refs.filters.style.height = `${this.$refs.filters.firstChild.offsetHeight}px`;
            } else {
                this.$refs.filters.style.height = "0";
            }
        },
        setFilter(filter) {
            this.$store.commit("notes/SET_FILTER", filter);
        }
    }
};
</script>
