<template>
    <Layout>
        <template v-slot:header>
            <Container class="mt-4">
                <header class="flex items-center space-x-2 mb-3">
                    <img
                        class="h-6"
                        src="/img/marianne.svg"
                        alt="République Française"
                    />
                    <h1 class="font-bold text-lg">Résorption-bidonvilles</h1>
                </header>
                <h2 class="font-bold text-display-md">
                    Bienvenue {{ user.first_name }} {{ user.last_name }}
                </h2>
            </Container>
        </template>
        <template v-slot:scroll>
            <template v-if="state !== 'error'">
                <Container class="mt-6">
                    <div class="font-bold text-lg">Rechercher un site</div>
                    <SearchInput
                        class="mt-2 mb-6"
                        @click="openSearch"
                        placeholder="Rechercher un site"
                    />
                    <div class="font-bold text-lg">
                        Mes sites ({{ myTowns.length }})
                    </div>
                    <div class="italic">
                        <span v-if="state === 'loading'"
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
                        <span v-if="state === 'loading'"
                            >chargement en cours...</span
                        >
                        <span v-else-if="consultedTowns.length === 0"
                            >vous n'avez consulté aucun site récemment</span
                        >
                    </div>
                </Container>
                <TownCarousel :towns="consultedTowns" />
            </template>

            <Container class="mt-24 text-center" v-else>
                <p>
                    <span class="font-bold text-primary"
                        >Le chargement des données a échoué :</span
                    ><br />
                    <span>{{ error }}</span
                    ><br />
                    <Button
                        class="mt-3"
                        @click="load"
                        icon="arrow-alt-circle-right"
                    >
                        Réessayer
                    </Button>
                </p>
            </Container>
        </template>
    </Layout>
</template>

<script>
import { Button } from "@resorptionbidonvilles/ui";
import Container from "../../components/Container.vue";
import TownCarousel from "./TownCarousel.vue";
import { mapGetters } from "vuex";
import Layout from "#src/js/components/Layout.vue";
import SearchInput from "#src/js/components/SearchInput.vue";

export default {
    components: {
        // eslint-disable-next-line vue/no-reserved-component-names
        Button,
        Container,
        Layout,
        TownCarousel,
        SearchInput,
    },
    mounted() {
        this.load();
    },
    computed: {
        ...mapGetters({
            myTowns: "myTowns",
            consultedTowns: "consultedTowns",
            error: "townsError",
            state: "townsState",
        }),
        user() {
            return this.$store.state.config.configuration.user;
        },
    },

    methods: {
        load() {
            if (this.state !== "loaded") {
                this.$store.dispatch("fetchTowns");
            }
        },
        openSearch() {
            this.$store.commit("search/SET_LISTENER", this.onSearch.bind(this));
            this.$router.push("/recherche-de-site");
        },
        onSearch(town) {
            setTimeout(() => {
                this.$router.push(`/site/${town.id}`);
            }, 100);
        },
    },
};
</script>
