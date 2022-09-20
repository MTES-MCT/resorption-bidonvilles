<template>
    <Layout>
        <Container>
            <div class="my-8 font-bold text-xl">
                Bienvenue {{ user.first_name }} {{ user.last_name }}
            </div>
            <span class="font-bold"> Mes sites ({{ myTowns.length }}) </span>
        </Container>
        <div
            id="section-carousel"
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
            <span class="font-bold">
                Sites récemment consultés ({{ consultedTowns.length }})
            </span>
        </Container>
        <div
            id="section-carousel"
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
