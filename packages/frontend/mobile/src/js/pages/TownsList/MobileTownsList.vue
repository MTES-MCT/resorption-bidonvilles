<template>
    <Layout>
        <template v-slot:header>
            <Container>
                <header>
                    <h1 class="font-bold text-display-md">
                        Bienvenue {{ user.first_name }} {{ user.last_name }}
                    </h1>
                </header>
            </Container>
        </template>
        <template v-slot:scroll>
            <Container class="mt-6">
                <div class="font-bold text-lg">
                    Mes sites ({{ myTowns.length }})
                </div>
                <div class="italic">
                    <span v-if="state !== 'loaded'"
                        >chargement en cours...</span
                    >
                    <span v-else-if="myTowns.length === 0"
                        >vous n'intervenez sur aucun site</span
                    >
                </div>
            </Container>
            <TownCarousel :towns="myTowns" />

            <Container class="mt-6">
                <div class="font-bold text-lg">
                    Sites récemment consultés ({{ consultedTowns.length }})
                </div>
                <div class="italic">
                    <span v-if="state !== 'loaded'"
                        >chargement en cours...</span
                    >
                    <span v-else-if="consultedTowns.length === 0"
                        >vous n'avez consulté aucun site récemment</span
                    >
                </div>
            </Container>
            <TownCarousel :towns="consultedTowns" />
        </template>
    </Layout>
</template>

<script>
import Container from "../../components/Container.vue";
import TownCarousel from "./TownCarousel.vue";
import { mapGetters } from "vuex";
import Layout from "#src/js/components/Layout.vue";

export default {
    components: {
        Container,
        Layout,
        TownCarousel
    },
    mounted() {
        this.load();
    },
    computed: {
        ...mapGetters({
            myTowns: "myTowns",
            consultedTowns: "consultedTowns",
            error: "townsError",
            state: "townsState"
        }),
        user() {
            return this.$store.state.config.configuration.user;
        }
    },

    methods: {
        load() {
            if (this.state !== "loaded") {
                this.$store.dispatch("fetchTowns");
            }
        }
    }
};
</script>
