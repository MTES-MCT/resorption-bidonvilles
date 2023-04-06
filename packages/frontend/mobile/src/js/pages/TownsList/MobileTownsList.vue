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
            <div class="pb-6">
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
                    <TownCarousel
                        :towns="myTowns"
                        id="mes_sites"
                        class="mb-8"
                    />

                    <Container class="mt-6">
                        <div class="font-bold text-lg">
                            Sites récemment consultés ({{
                                consultedTowns.length
                            }})
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
                        class="mb-8"
                    />

                    <Container class="mt-6">
                        <div class="font-bold text-lg">
                            Sites à proximité<template
                                v-if="geoLocation.isLoaded"
                            >
                                ({{ nearbyTowns.length }})</template
                            >
                        </div>
                        <p class="italic">
                            <span v-if="state === 'loading'"
                                >chargement en cours...</span
                            >
                            <template
                                v-else-if="
                                    geoPermissionState === 'denied' ||
                                    geoLocation.denied === true
                                "
                            >
                                Nous n'avons pas accès à votre géolocalisation,
                                veuillez vérifier les autorisations configurées
                                sur votre appareil.
                            </template>
                            <template
                                v-else-if="
                                    geoPermissionState === 'prompt' ||
                                    geoLocation.isLoaded === false
                                "
                            >
                                <Button
                                    @click="findNearbyShantytowns"
                                    :loading="geoLocation.isLoading"
                                    >Rechercher les sites à moins de
                                    500m</Button
                                >
                            </template>
                            <!-- cas "granted" ci-dessous -->
                            <template v-else-if="nearbyTowns.length === 0">
                                Aucun site trouvé à moins de 500m
                            </template>
                        </p>
                    </Container>
                    <TownCarousel
                        id="sites_a_proximite"
                        :towns="nearbyTowns"
                        class="mb-2"
                    />
                    <Container v-if="geoLocation.isLoaded === true">
                        <p>
                            <Button
                                @click="findNearbyShantytowns"
                                :loading="geoLocation.isLoading"
                                >Rafraîchir la liste</Button
                            >
                        </p>
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
            </div>
        </template>
    </Layout>
</template>

<script>
import { Button, Icon } from "@resorptionbidonvilles/ui";
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
        Container,
        Layout,
        TownCarousel,
        SearchInput,
    },
    data: function () {
        return {
            geoPermission: null,
            geoLocation: {
                isLoading: false,
                isLoaded: false,
                denied: false,
                error: null,
            },
        };
    },
    async mounted() {
        this.load();
        this.geoPermission = await navigator.permissions.query({
            name: "geolocation",
        });
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
        geoPermissionState() {
            return this.geoPermission && this.geoPermission.state;
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
        getLocation() {
            return new Promise((resolve, reject) => {
                return navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: true,
                        maximumAge: 2000,
                        timeout: 15000,
                    }
                );
            });
        },
        async findNearbyShantytowns() {
            if (this.geoLocation.isLoading === true) {
                return;
            }

            this.geoLocation.isLoading = true;
            this.geoLocation.isLoaded = false;
            this.geoLocation.error = null;
            this.geoLocation.denied = false;
            this.$store.dispatch("setNearbyTowns", []);

            try {
                const geoLocation = await this.getLocation();
                if (geoLocation.coords.accuracy > 100) {
                    this.geoLocation.error = `La position calculée n'est pas très précise : (${parseFloat(
                        geoLocation.coords.accuracy
                    ).toFixed(2)} m)`;
                } else {
                    const { towns } = await findNearby(
                        geoLocation.coords.latitude,
                        geoLocation.coords.longitude
                    );
                    this.$store.dispatch("setNearbyTowns", towns);
                    this.geoLocation.isLoaded = true;
                }
            } catch (e) {
                if (e.code === 1) {
                    this.geoLocation.denied = true;
                } else {
                    this.geoLocation.error = this.getLocationErrorMessage(
                        e.code
                    );
                }
            }

            this.geoLocation.isLoading = false;
        },

        getLocationErrorMessage(code) {
            const errors = {
                2: "La géolocalisation a échoué.",
                3: "La requête de géolocalisation a mis trop de temps à s'exécuter.",
            };

            return errors[code] || "Une erreur inconnue est survenue";
        },
    },
};
</script>
