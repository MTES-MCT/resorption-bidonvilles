<template>
    <Layout :logo="false" :navbar="false">
        <template v-slot:header>
            <TownsSearchHeader ref="searchbar" />
            <TownSearchFilter
                :selectedFilter="filter"
                @changeFilter="changeFilter"
                v-if="this.$store.state.search.search"
            />
        </template>

        <template v-slot:scroll>
            <main class="pt-6">
                <Container>
                    <template v-if="!loading && !error">
                        <SearchSection
                            v-for="section in sections"
                            :key="section.title"
                            :title="section.title"
                            :items="section.items"
                        />
                    </template>
                    <p v-else-if="error">
                        <span class="font-bold text-primary"
                            >La recherche a échoué</span
                        ><br />
                        <span>{{ error }}</span
                        ><br />
                        <Button
                            class="mt-3"
                            @click="$refs.searchbar.startSearch"
                            icon="arrow-alt-circle-right"
                        >
                            Réessayer
                        </Button>
                    </p>
                    <Spinner v-else />
                </Container>
            </main>
        </template>
    </Layout>
</template>

<script>
import Container from "#src/js/components/Container.vue";
import Layout from "#src/js/components/Layout.vue";
import SearchSection from "./SearchSection.vue";
import TownsSearchHeader from "./TownsSearchHeader.vue";
import TownSearchFilter from "./TownSearchFilter.vue";
import { Button, Spinner } from "@resorptionbidonvilles/ui";

export default {
    data() {
        return {
            filter: "all",
        };
    },
    components: {
        Button,
        Container,
        Layout,
        SearchSection,
        Spinner,
        TownsSearchHeader,
        TownSearchFilter,
    },
    mounted() {
        if (this.$store.state.towns.state !== "loaded") {
            this.$store.dispatch("fetchTowns");
        }
    },
    methods: {
        changeFilter(value) {
            this.filter = value;
        },
    },
    computed: {
        loading() {
            if (this.$store.state.search.search) {
                return !this.$store.state.search.results;
            }

            return this.$store.state.towns.state === "loading";
        },
        error() {
            return this.$store.state.search.error;
        },
        filteredResults() {
            if (this.$store.state.search.results) {
                return this.$store.state.search.results.filter((town) => {
                    if (this.filter === "all") {
                        return true;
                    } else if (this.filter === "open") {
                        return town.closedAt === null;
                    } else if (this.filter === "closed") {
                        return town.closedAt !== null;
                    }
                });
            }
            return [];
        },
        sections() {
            if (this.loading) {
                return;
            }

            if (this.$store.state.search.results) {
                return [
                    {
                        title: "Résultats de recherche",
                        items: this.filteredResults,
                    },
                ];
            }

            return [
                { title: "Mes sites", items: this.$store.state.towns.myTowns },
                {
                    title: "Sites récemment consultés",
                    items: this.$store.state.towns.consultedTowns,
                },
            ];
        },
    },
};
</script>
