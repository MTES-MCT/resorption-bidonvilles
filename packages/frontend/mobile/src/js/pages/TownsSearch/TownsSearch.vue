<template>
    <Layout :logo="false" :navbar="false">
        <template slot="header">
            <TownsSearchHeader />
        </template>

        <template slot="scroll">
            <main class="pt-6">
                <Container>
                    <template v-if="!loading">
                        <SearchSection
                            v-for="section in sections"
                            :key="section.title"
                            :title="section.title"
                            :items="section.items"
                        />
                    </template>
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
import { Spinner } from "@resorptionbidonvilles/ui";

export default {
    components: {
        Container,
        Layout,
        SearchSection,
        Spinner,
        TownsSearchHeader
    },
    mounted() {
        if (this.$store.state.towns.state !== "loaded") {
            this.$store.dispatch("fetchTowns");
        }
    },
    computed: {
        loading() {
            if (this.$store.state.search.search) {
                return !this.$store.state.search.results;
            }

            return this.$store.state.towns.state === "loading";
        },
        sections() {
            if (this.loading) {
                return;
            }

            if (this.$store.state.search.results) {
                return [
                    {
                        title: "Résultats de recherche",
                        items: this.$store.state.search.results
                    }
                ];
            }

            return [
                { title: "Mes sites", items: this.$store.state.towns.myTowns },
                {
                    title: "Sites récemment consultés",
                    items: this.$store.state.towns.consultedTowns
                }
            ];
        }
    }
};
</script>
