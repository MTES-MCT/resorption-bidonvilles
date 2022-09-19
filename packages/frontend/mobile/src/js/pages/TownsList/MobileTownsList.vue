<template>
    <Layout>
        <div class="mx-4 my-8 font-bold text-xl">
            Bienvenue {{ user.first_name }} {{ user.last_name }}
        </div>

        <div class="mx-4 my-4">
            <span class="font-bold text-primary">
                Mes sites ({{ myTowns.length }})
            </span>

            <br />
            <span>Sites sur lesquels vous intervenez</span>
            <div class="mt-4"><Carousel :items="myTowns" /></div>
        </div>

        <div class="mx-4 my-4">
            <span class="font-bold text-primary">
                Sites récemment consultés ({{ consultedTowns.length }})</span
            >
            <br />
            <span
                >Les {{ consultedTowns.length }} derniers sites que vous avez
                consultés</span
            >
            <div><Carousel :items="consultedTowns" /></div>
        </div>

        <Button @click="disconnect" class="mb-8"> Me déconnecter </Button>
    </Layout>
</template>

<script>
import { Button } from "@resorptionbidonvilles/ui";
import Carousel from "../../components/Carousel.vue";
import { mapGetters } from "vuex";
import Layout from "#src/js/components/Layout.vue";

export default {
    data() {
        return {
            // myTowns: [],
            consultedTowns: [
                {
                    id: 5,
                    addressSimple: "Avenue Gay Lussac",
                    name: null,
                    city: {
                        name: "Ambarès-et-Lagrave"
                    }
                },
                {
                    id: 6,
                    addressSimple: "Rue des Noyers",
                    name: null,
                    city: {
                        name: "Ambarès-et-Lagrave"
                    }
                },
                {
                    id: 7,
                    addressSimple: "57 Boulevard Feydeau",
                    name: null,
                    city: {
                        name: "Ambarès-et-Lagrave"
                    }
                },
                {
                    id: 1,
                    addressSimple: "37 Rue de Bassens",
                    name: null,
                    city: {
                        name: "Ambarès-et-Lagrave"
                    }
                },
                {
                    id: 2,
                    addressSimple: "32 Avenue du Chemin de la Vie",
                    name: null,
                    city: {
                        name: "Ambarès-et-Lagrave"
                    }
                },
                {
                    id: 3,
                    addressSimple: "74 Avenue de la Liberté",
                    name: null,
                    city: {
                        name: "Ambarès-et-Lagrave"
                    }
                },
                {
                    id: 4,
                    addressSimple: "9 Rue du Broustey",
                    name: null,
                    city: {
                        name: "Ambarès-et-Lagrave"
                    }
                }
            ]
        };
    },
    components: {
        Button,
        Carousel,
        Layout
    },
    mounted() {
        this.load();
    },
    computed: {
        ...mapGetters({
            myTowns: "townsItems",
            error: "townsError",
            state: "townsState"
        }),
        user() {
            return this.$store.state.config.configuration.user;
        }
    },
    methods: {
        disconnect() {
            this.$router.push("/deconnexion");
        },
        load() {
            if (this.state !== "loaded") {
                this.$store.dispatch("fetchTowns");
            }
        }
    }
};
</script>
