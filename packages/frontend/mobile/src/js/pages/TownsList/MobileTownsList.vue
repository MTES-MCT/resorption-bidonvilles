<template>
    <Layout>
        <Container>
            <header>
                <h1 class="my-8 font-bold text-display-md text-center">
                    Bienvenue {{ user.first_name }} {{ user.last_name }}
                </h1>
            </header>
        </Container>
        <Container>
            <div class="font-bold text-lg">
                Mes sites ({{ myTowns.length }})
            </div>
            <div class="italic" v-if="myTowns.length === 0">
                vous n'intervenez sur aucun site
            </div>
        </Container>
        <div
            v-if="myTowns.length > 0"
            class="whitespace-no-wrap overflow-y-auto mb-8 mt-2"
        >
            <Container>
                <TownCard
                    v-for="town in myTowns"
                    :key="town.id"
                    :town="town"
                ></TownCard>
            </Container>
        </div>
        <Container>
            <div class="font-bold text-lg">
                Sites récemment consultés ({{ consultedTowns.length }})
            </div>
            <div class="italic" v-if="consultedTowns.length === 0">
                vous n'avez consulté aucun site récemment
            </div>
        </Container>
        <div
            v-if="consultedTowns.length > 0"
            class="whitespace-no-wrap overflow-y-auto mb-8 mt-2"
        >
            <Container>
                <TownCard
                    v-for="town in consultedTowns"
                    :key="town.id"
                    :town="town"
                ></TownCard>
            </Container>
        </div>
    </Layout>
</template>

<script>
import TownCard from "./TownCard.vue";
import Container from "../../components/Container.vue";
import { mapGetters } from "vuex";
import Layout from "#src/js/components/Layout.vue";

export default {
    components: {
        TownCard,
        Container,
        Layout
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
