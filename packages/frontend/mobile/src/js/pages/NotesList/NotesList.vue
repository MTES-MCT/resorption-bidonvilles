<template>
    <Layout>
        <template v-slot:header>
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
                class="bg-G300 mt-3 overflow-hidden"
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
            </Container>
        </template>

        <template v-slot:scroll>
            <Container v-if="notes.length === 0">
                <section class="mt-12 text-center">
                    <template v-if="currentFilter !== 'published'">
                        <img
                            src="/img/illustrations/notes_empty.svg"
                            class="w-1/2 mx-auto max-w-lg"
                        />
                        <Button @click.native="create"
                            >Cliquez ici pour rédiger votre première
                            note</Button
                        >
                    </template>
                    <template v-else>
                        <p class="text-G700 italic">
                            Vous n'avez publié aucune de vos notes dans un
                            journal de site pour le moment.
                        </p>
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

<style scoped>
#filters {
    transition: height 0.5s 0s ease-in-out;
}
</style>

<script>
import Layout from "#src/js/components/Layout.vue";
import Container from "#src/js/components/Container.vue";
import LeftSlidingBlock from "#src/js/components/LeftSlidingBlock.vue";
import { Button, Icon } from "@resorptionbidonvilles/ui";
import NotesListItem from "./NotesListItem.vue";
import { mapGetters } from "vuex";

export default {
    components: {
        Layout,
        Container,
        LeftSlidingBlock,
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
            ]
        };
    },
    computed: {
        ...mapGetters({
            notes: "notes/filteredNotes"
        }),
        filterBarIsOpen: {
            get() {
                return this.$store.state.notes.filterBarIsOpen;
            },
            set(value) {
                this.$store.commit("notes/SET_FILTER_BAR_IS_OPEN", value);
            }
        },
        currentFilter() {
            return this.$store.state.notes.filter;
        }
    },
    mounted() {
        if (!this.filterBarIsOpen) {
            this.hideFilterBar();
        } else {
            this.showFilterBar();
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
        },
        toggleFilters() {
            this.filterBarIsOpen = !this.filterBarIsOpen;

            if (this.filterBarIsOpen) {
                this.showFilterBar();
            } else {
                this.hideFilterBar();
            }
        },
        showFilterBar() {
            this.$refs.filters.style.height = `${this.$refs.filters.firstChild.offsetHeight}px`;
        },
        hideFilterBar() {
            this.$refs.filters.style.height = "0";
        },
        setFilter(filter) {
            this.$store.commit("notes/SET_FILTER", filter);
        }
    }
};
</script>
