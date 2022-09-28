<template>
    <header>
        <NotesListTopBar @toggle="onToggleFilters" @create="$emit('create')" />
        <NotesListFilters ref="filters" />

        <Container>
            <p class="hidden md:block">
                Prenez des notes de vos passages sur le terrain puis partagez
                les facilement dans les journaux des sites ou par mail à vos
                collaborateur(ice).
            </p>
        </Container>
    </header>
</template>

<script>
import Container from "#src/js/components/Container.vue";
import NotesListTopBar from "./NotesListTopBar.vue";
import NotesListFilters from "./NotesListFilters.vue";

export default {
    components: {
        Container,
        NotesListTopBar,
        NotesListFilters
    },

    computed: {
        filterBarIsOpen: {
            get() {
                return this.$store.state.notes.filterBarIsOpen;
            },
            set(value) {
                this.$store.commit("notes/SET_FILTER_BAR_IS_OPEN", value);
            }
        }
    },

    mounted() {
        if (!this.filterBarIsOpen) {
            this.hideFilters();
        } else {
            this.showFilters();
        }
    },

    methods: {
        showFilters() {
            this.$refs.filters.show();
        },
        hideFilters() {
            this.$refs.filters.hide();
        },
        onToggleFilters() {
            this.filterBarIsOpen = !this.filterBarIsOpen;

            if (!this.filterBarIsOpen) {
                this.hideFilters();
            } else {
                this.showFilters();
            }
        }
    }
};
</script>
