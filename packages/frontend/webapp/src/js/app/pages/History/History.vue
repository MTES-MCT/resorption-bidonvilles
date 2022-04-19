<template>
    <PrivateLayout>
        <HistorySearchbar @locationChange="onLocationChange"></HistorySearchbar>

        <div>
            <HistoryLoader
                v-if="loading && activities.length === 0"
            ></HistoryLoader>

            <PrivateContainer v-else class="py-6">
                <HistoryModerationPanel v-if="canModerate" />

                <h1 class="text-display-lg font-bold mb-2">
                    Dernières activités -
                    <span class="text-primary">{{ locationName }}</span>
                </h1>
                <HistoryFilterBar class="mb-6"></HistoryFilterBar>

                <div v-if="activities.length > 0">
                    <HistoryCardGroup
                        v-for="group in parsedActivities"
                        :date="group.date"
                        :items="group.items"
                        :key="group.id"
                        class="mb-4"
                    ></HistoryCardGroup>
                    <div
                        class="text-center text-primary text-display-md font-bold"
                        v-if="loading"
                    >
                        <Spinner />
                    </div>
                </div>

                <HistoryEmpty v-else />
            </PrivateContainer>
        </div>
    </PrivateLayout>
</template>

<script>
import PrivateLayout from "#app/components/PrivateLayout";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer.vue";
import HistoryLoader from "./HistoryLoader.vue";
import HistorySearchbar from "./HistorySearchbar.vue";
import HistoryFilterBar from "./HistoryFilterBar.vue";
import HistoryCardGroup from "./HistoryCardGroup.vue";
import HistoryEmpty from "./HistoryEmpty.vue";
import HistoryModerationPanel from "./HistoryModerationPanel.vue";

import { mapGetters } from "vuex";

export default {
    components: {
        PrivateLayout,
        PrivateContainer,
        HistoryLoader,
        HistorySearchbar,
        HistoryFilterBar,
        HistoryCardGroup,
        HistoryEmpty,
        HistoryModerationPanel
    },
    data() {
        return {
            canModerate: this.$store.getters["config/hasPermission"](
                "shantytown_comment.moderate"
            ),
            locationName: "Inconnu"
        };
    },
    computed: {
        ...mapGetters({
            loading: "activitiesLoading",
            error: "activitiesError",
            activities: "activities",
            endOfActivities: "endOfActivities",
            loadedLocationType: "activitiesLoadedLocationType",
            loadedLocationCode: "activitiesLoadedLocationCode",
            loadedFilters: "activitiesLoadedFilters",
            locations: "locations",
            filters: "activitiesFilters"
        }),
        parsedActivities() {
            const groups = [];
            for (let i = 0, lastDate; i < this.activities.length; i += 1) {
                const item = this.activities[i];
                const date = new Date(item.date * 1000);
                const dateStr = `${date
                    .getDate()
                    .toString()
                    .padStart(2, "0")}${date
                    .getMonth()
                    .toString()
                    .padStart(2, "0")}${date.getFullYear()}`;

                // si cet item n'est pas à la même date que le précédent on crée un nouveau groupe
                if (!lastDate || dateStr !== lastDate) {
                    groups.push({
                        id: [
                            this.locationType,
                            this.locationCode,
                            dateStr
                        ].join("-"),
                        date,
                        items: [item]
                    });
                }
                // sinon on ajoute l'item au dernier groupe en date
                else {
                    groups[groups.length - 1].items.push(item);
                }

                lastDate = dateStr;
            }
            return groups;
        },
        locationType() {
            return this.$route.params.locationType || null;
        },
        locationCode() {
            return this.$route.params.locationCode || null;
        },
        defaultPath() {
            const {
                location
            } = this.$store.state.config.configuration.user.organization;
            return `/activites/${location.type}/${location[location.type]
                ?.code || ""}`;
        }
    },

    watch: {
        "$route.params.locationType"() {
            this.load();
        },
        "$route.params.locationCode"() {
            this.load();
        },
        filters() {
            this.load();
        }
    },

    mounted() {
        this.load();
        window.addEventListener("scroll", this.reachBottom);
    },

    destroyed() {
        window.removeEventListener("scroll", this.reachBottom);
    },

    methods: {
        async load() {
            // on réécrit l'URL si l'accès se fait par "/activites"
            if (!this.locationType) {
                this.$router.replace(this.defaultPath);
                return;
            }

            // si on a déjà chargé cette location (ou qu'on est en train de le faire) : stop !
            const strFilters = [...this.filters].sort().join("_");
            if (
                this.loadedLocationType === this.locationType &&
                this.loadedLocationCode === this.locationCode &&
                this.loadedFilters === strFilters
            ) {
                return;
            }

            // on fetch les activités
            this.$store.dispatch("fetchActivities", {
                location: {
                    locationType: this.locationType,
                    locationCode: this.locationCode
                }
            });

            // on fetch le nom de la location, si elle n'est pas déjà dans le $store
            // nécessaire pour l'affichage dans la UI et la barre de recherche
            if (this.locationType !== "nation") {
                if (!this.locations[this.locationType]?.[this.locationCode]) {
                    await this.$store.dispatch("fetchLocation", {
                        type: this.locationType,
                        code: this.locationCode
                    });
                }
            }

            // on remplit la barre de recherche
            if (this.locationType === "nation") {
                this.$store.commit("setActivityLocationFilter", null);
            } else {
                this.$store.commit(
                    "setActivityLocationFilter",
                    this.locations[this.locationType][this.locationCode]
                );
            }

            this.locationName = this.getLocationName();
        },

        async loadNext() {
            // on a déjà chargé toutes les activités : stop !
            if (this.endOfActivities === true) {
                return;
            }

            // on est déjà en train de fetch : stop !
            if (this.loading === true) {
                return;
            }

            // on fetch les activités
            this.$store.dispatch("fetchActivities");
        },

        getLocationName() {
            if (this.locationType === "nation") {
                return "France";
            }
            return (
                this.locations[this.locationType]?.[this.locationCode]?.label ||
                "Inconnu"
            );
        },

        reachBottom() {
            let bottomOfWindow =
                document.documentElement.offsetHeight -
                    document.documentElement.scrollTop -
                    window.innerHeight <
                window.innerHeight;
            if (bottomOfWindow) {
                this.loadNext();
            }
        },

        onLocationChange() {
            // on redirige vers la bonne URL (ce qui automatiquement relancera un getActivities() via les watchers)
            const { location } = this.$store.state.activities.filters;
            if (location === null) {
                this.routeTo("/activites/nation");
            } else {
                const { type, code } = location.data;
                this.routeTo(`/activites/${type}/${code}`);
            }
        },

        routeTo(path) {
            // on évite de réécrire l'URL si on est déjà sur la bonne
            if (this.$route.path === path) {
                return;
            }
            this.$router.replace(path);
        }
    }
};
</script>
