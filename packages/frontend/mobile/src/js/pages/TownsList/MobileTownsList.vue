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
                <div class="italic" v-if="myTowns.length === 0">
                    vous n'intervenez sur aucun site
                </div>
            </Container>
            <TownCarousel :towns="myTowns" />

            <Container class="mt-6">
                <div class="font-bold text-lg">
                    Sites récemment consultés ({{ consultedTowns.length }})
                </div>
                <div class="italic" v-if="consultedTowns.length === 0">
                    vous n'avez consulté aucun site récemment
                </div>
            </Container>
            <TownCarousel :towns="consultedTowns" />

            <template v-if="gettingLocation === false">
                <Container v-if="nearbyTownsExist" class="mt-6">
                    <div class="font-bold text-lg">
                        Sites à proximité ({{ nearbyTowns.length }})
                    </div>
                    <div class="italic" v-if="nearbyTowns.length === 0">
                        Aucun site trouvé à proximité
                    </div>
                </Container>
                <TownCarousel v-if="nearbyTownsExist" :towns="nearbyTowns" />
            </template>

            <Container class="mt-6">
                <div class="text-secondary mb-2" v-if="errorStr">
                    {{ errorStr }}
                </div>
                <div class="mb-2" v-if="!isOnline">
                    Veuillez vous connecter au réseau pour que nous puissions
                    vous indiquer les sites à proximité.
                </div>
                <div v-if="gettingLocation === true">
                    <Spinner /> <i>Calcul de votre position en cours...</i>
                </div>

                <template v-else>
                    <div class="mb-2" v-if="!geoLocation">
                        Veuillez activer la géolocalisation pour afficher les
                        sites à proximité...
                    </div>
                    <Button size="sm" @click="refreshLocation"
                        >Rafraîchir ma position</Button
                    >
                </template>
            </Container>
        </template>
    </Layout>
</template>

<script>
import Container from "../../components/Container.vue";
import TownCarousel from "./TownCarousel.vue";
import { mapGetters } from "vuex";
import { findNearby } from "#helpers/town";
import Layout from "#src/js/components/Layout.vue";
import { Button, Spinner } from "@resorptionbidonvilles/ui";

export default {
    components: {
        Container,
        Layout,
        TownCarousel,
        Button,
        Spinner
    },
    data: function() {
        return {
            geoLocation: null,
            gettingLocation: false,
            errorStr: null
        };
    },
    mounted() {
        this.load();
    },
    computed: {
        ...mapGetters({
            myTowns: "myTowns",
            consultedTowns: "consultedTowns",
            nearbyTowns: "nearbyTowns",
            error: "townsError",
            state: "townsState",
            loadingNearbyTowns: "loadingNearbyTowns"
        }),
        user() {
            return this.$store.state.config.configuration.user;
        },
        isOnline() {
            return navigator.onLine;
        },
        nearbyTownsExist() {
            return this.nearbyTowns ? true : false;
        }
    },
    watch: {
        geoLocation: async function() {
            try {
                const { towns } = await findNearby(
                    this.geoLocation.coords.latitude,
                    this.geoLocation.coords.longitude
                );
                this.$store.dispatch("setNearbyTowns", towns);
            } catch (err) {
                console.log(err);
            }
        }
    },
    methods: {
        load() {
            if (this.state !== "loaded") {
                this.$store.dispatch("fetchTowns");
            }
        },
        setErrorMessage(message) {
            this.errorStr = message;
        },
        async getLocation() {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    pos => {
                        resolve(pos);
                    },
                    err => {
                        reject(err);
                    },
                    {
                        enableHighAccuracy: true,
                        maximumAge: 2000,
                        timeout: 15000
                    }
                );
            });
        },
        async refreshLocation() {
            this.errorStr = "";
            this.gettingLocation = true;
            this.$store.dispatch("setNearbyTowns", []);
            try {
                this.geoLocation = await this.getLocation();
                if (this.geoLocation.coords.accuracy > 100) {
                    this.errorStr = `La position calculée n'est pas très précise: (${parseFloat(
                        this.geoLocation.coords.accuracy
                    ).toFixed(2)} m)`;
                }
                this.gettingLocation = false;
            } catch (e) {
                this.gettingLocation = false;
                switch (e.code) {
                    case 1:
                        this.errorStr =
                            "L'utilisateur a refusé la requête de géolocalisation.";
                        break;
                    case 2:
                        this.errorStr =
                            "La localisation géographique n'a pas été trouvée.";
                        break;
                    case 3:
                        this.errorStr =
                            "La requête de localisation géographique a mis trop de temps à s'exécuter.";
                        break;
                    default:
                        this.errorStr = "Une erreur inconnue est survenue.";
                        break;
                }
            }
        }
    }
};
</script>
