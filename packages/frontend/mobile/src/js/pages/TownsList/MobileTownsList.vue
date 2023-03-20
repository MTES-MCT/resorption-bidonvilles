<template>
    <Layout>
        <template v-slot:header>
            <div
                class="bg-primary text-white py-3 text-center"
                @click="redirectToWebapp"
            >
                <Icon icon="arrow-alt-circle-right" class="mr-1" /> Voir la
                version navigateur
            </div>
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
                        placeholder="une ville, un département, un site..."
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
                <TownCarousel :towns="myTowns" id="mes_sites" />

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

                <TownCarousel
                    :towns="consultedTowns"
                    id="sites_recemment_consultes"
                />

                <template v-if="gettingLocation === false">
                    <Container v-if="nearbyTowns.length > 0" class="mt-6">
                        <div class="font-bold text-lg">
                            Sites à proximité ({{ nearbyTowns.length }})
                        </div>
                        <div class="italic" v-if="nearbyTowns.length === 0">
                            Aucun site trouvé à proximité
                        </div>
                    </Container>
                    <TownCarousel
                        v-if="nearbyTowns.length > 0"
                        :towns="nearbyTowns"
                    />
                </template>

                <Container class="mt-6">
                    <div
                        class="text-secondary text-sm mb-2"
                        v-if="locationError"
                    >
                        {{ locationError }}
                    </div>
                    <div class="mb-2" v-if="!isOnline">
                        Veuillez vous connecter au réseau pour que nous
                        puissions vous indiquer les sites à proximité.
                    </div>
                    <div v-if="gettingLocation === true">
                        <Spinner /> <i>Calcul de votre position en cours...</i>
                    </div>

                    <template v-else>
                        <div class="mb-2" v-if="!geoLocation">
                            Veuillez activer la géolocalisation pour afficher
                            les sites à proximité...
                        </div>
                        <Button size="sm" @click="refreshLocation"
                            >Rafraîchir ma position</Button
                        >
                    </template>
                </Container>
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
import { Button, Icon, Spinner } from "@resorptionbidonvilles/ui";
import Container from "../../components/Container.vue";
import TownCarousel from "./TownCarousel.vue";
import { mapGetters } from "vuex";
import { findNearby } from "#helpers/town";
import Layout from "#src/js/components/Layout.vue";
import SearchInput from "#src/js/components/SearchInput.vue";
import ENV from "#src/env.js";
import routeToTown from "#src/js/utils/routeToTown";

export default {
    components: {
        // eslint-disable-next-line vue/no-reserved-component-names
        Button,
        Icon,
        Spinner,
        Container,
        Layout,
        TownCarousel,
        SearchInput,
    },
    data: function () {
        return {
            geoLocation: null,
            gettingLocation: false,
            locationError: null,
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
            loadingNearbyTowns: "loadingNearbyTowns",
        }),
        user() {
            return this.$store.state.config.configuration.user;
        },
        isOnline() {
            return navigator.onLine;
        },
    },
    watch: {
        geoLocation: async function () {
            try {
                const { towns } = await findNearby(
                    this.geoLocation.coords.latitude,
                    this.geoLocation.coords.longitude
                );
                this.$store.dispatch("setNearbyTowns", towns);
            } catch (err) {
                console.log(err);
            }
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
                routeToTown(town.id, "recherche");
            }, 100);
        },
        redirectToWebapp() {
            document.cookie = `device=webapp;domain=${ENV.VITE_MOBILE_DOMAIN}`;
            location.replace(ENV.VITE_WEBAPP_URL);
        },
        async getLocation() {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        resolve(pos);
                    },
                    (err) => {
                        reject(err);
                    },
                    {
                        enableHighAccuracy: true,
                        maximumAge: 2000,
                        timeout: 15000,
                    }
                );
            });
        },
        async refreshLocation() {
            this.locationError = "";
            this.gettingLocation = true;
            this.$store.dispatch("setNearbyTowns", []);
            try {
                this.geoLocation = await this.getLocation();
                if (this.geoLocation.coords.accuracy > 100) {
                    this.locationError = `La position calculée n'est pas très précise: (${parseFloat(
                        this.geoLocation.coords.accuracy
                    ).toFixed(2)} m)`;
                }
                this.gettingLocation = false;
            } catch (e) {
                console.log(e);
                this.gettingLocation = false;
                this.locationError = this.getLocationErrorMessage(e.code);
            }
        },
        getLocationErrorMessage(code) {
            let message = "Une erreur inconnue est survenue.";
            if (code === 1) {
                message =
                    "L'utilisateur a refusé la requête de géolocalisation.";
            } else if (code === 2) {
                message = "La localisation géographique n'a pas été trouvée.";
            } else if (code === 3) {
                message =
                    "La requête de localisation géographique a mis trop de temps à s'exécuter.";
            }
            return message;
        },
    },
};
</script>
