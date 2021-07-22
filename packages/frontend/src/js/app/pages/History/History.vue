<template>
    <PrivateLayout>
        <HistorySearchbar @locationChange="onLocationChange"></HistorySearchbar>

        <div>
            <HistoryLoader v-if="loading"></HistoryLoader>

            <HistoryError v-else-if="error !== null" @retry="load">
                <template>{{ error }}</template>
            </HistoryError>

            <PrivateContainer v-else class="py-6">
                <h1 class="text-display-lg">
                    Dernières activités à
                    <span class="text-primary">{{ locationName }}</span>
                </h1>
                <HistoryFilterBar class="mb-6"></HistoryFilterBar>

                <div v-if="activities.length > 0">
                    <HistoryCardGroup
                        v-for="(group, index) in currentPageGroups"
                        :date="group.date"
                        :items="group.items"
                        :key="index"
                        class="mb-4"
                    ></HistoryCardGroup>

                    <HistoryPagination
                        class="mt-10 -mr-6 flex justify-end"
                    ></HistoryPagination>
                </div>

                <div v-else>
                    <HistoryEmpty></HistoryEmpty>
                </div>
            </PrivateContainer>
        </div>
    </PrivateLayout>
</template>

<script>
import PrivateLayout from "#app/components/PrivateLayout";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer.vue";
import HistoryLoader from "./HistoryLoader.vue";
import HistorySearchbar from "./HistorySearchbar.vue";
import HistoryError from "./HistoryError.vue";
import HistoryFilterBar from "./HistoryFilterBar.vue";
import HistoryPagination from "./HistoryPagination.vue";
import HistoryCardGroup from "./HistoryCardGroup.vue";
import HistoryEmpty from "./HistoryEmpty.vue";

import store from "#app/store";
import { mapGetters } from "vuex";
import { get as getConfig, getPermission } from "#helpers/api/config";

export default {
    components: {
        PrivateLayout,
        PrivateContainer,
        HistoryLoader,
        HistorySearchbar,
        HistoryError,
        HistoryFilterBar,
        HistoryPagination,
        HistoryCardGroup,
        HistoryEmpty
    },
    data() {
        return {
            locationName: "Inconnu"
        };
    },
    computed: {
        ...mapGetters({
            loading: "activitiesLoading",
            error: "activitiesError",
            activities: "activitiesFilteredItems",
            locations: "locations"
        }),
        currentPageItems() {
            const { itemsPerPage, currentPage } = store.state.activities;
            const start = (currentPage - 1) * itemsPerPage;

            return this.activities.slice(start, start + itemsPerPage);
        },
        currentPageGroups() {
            // on groupe les items de la page par date
            const groups = [];
            for (
                let i = 0, lastDate;
                i < this.currentPageItems.length;
                i += 1
            ) {
                const item = this.currentPageItems[i];
                const date = new Date(item.date * 1000);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                const dateStr = `${date.getDate()}${date.getMonth()}${date.getFullYear()}`;

                // si cet item n'est pas à la même date que le précédent on crée un nouveau groupe
                if (!lastDate || dateStr !== lastDate) {
                    groups.push({
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
            return this.$route.params.locationType;
        },
        locationCode() {
            return this.$route.params.locationCode;
        },
        defaultPath() {
            const { user } = getConfig();
            const { geographic_level } = getPermission("shantytown.list");
            if (geographic_level === "nation") {
                return "/activites/nation";
            }

            const { location } = user.organization;
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
        activities() {
            store.commit("setActivitiesPage", 1);
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            // on réécrit l'URL si l'accès se fait par "/activites"
            if (!this.locationType) {
                this.$router.replace(this.defaultPath);
                return;
            }

            // on fetch les activités
            if (store.state.activities.items.length === 0) {
                store.dispatch("fetchActivities");
            }

            // on fetch le nom de la location, si elle n'est pas déjà dans le store
            // nécessaire pour l'affichage dans la UI et la barre de recherche
            if (this.locationType !== "nation") {
                if (!this.locations[this.locationType]?.[this.locationCode]) {
                    // @todo: gérer une éventuelle erreur ici
                    await store.dispatch("fetchLocation", {
                        type: this.locationType,
                        code: this.locationCode
                    });
                }
            }

            // on remplit la barre de recherche
            if (
                this.locationType === "nation" ||
                this.$route.path === this.defaultPath
            ) {
                store.commit("setActivityLocationFilter", null);
            } else {
                store.commit(
                    "setActivityLocationFilter",
                    this.locations[this.locationType][this.locationCode]
                );
            }

            this.locationName = this.getLocationName();
        },

        getLocationName() {
            if (this.locationType === "nation") {
                return "France métropolitaine";
            }

            return (
                this.locations[this.locationType]?.[this.locationCode]?.label ||
                "Inconnu"
            );
        },

        onLocationChange() {
            // on redirige vers la bonne URL (ce qui automatiquement relancera un load() via les watchers)
            const { location } = store.state.activities.filters;
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
