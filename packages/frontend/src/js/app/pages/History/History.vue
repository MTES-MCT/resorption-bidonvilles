<template>
    <PrivateLayout>
        <HistorySearchbar @locationChange="onLocationChange"></HistorySearchbar>

        <div>
            <HistoryLoader v-if="loading"></HistoryLoader>

            <PrivateContainer v-else class="py-6">
                <HistoryModerationPanel v-if="canModerate" />

                <h1 class="text-display-lg mb-2">
                    Dernières activités -
                    <span class="text-primary">{{ locationName }}</span>
                </h1>
                <HistoryFilterBar
                    class="mb-6"
                    v-on:changeActivityFilter="changeActivityFilter"
                ></HistoryFilterBar>

                <div v-if="lastActivities.length > 0">
                    <HistoryCardGroup
                        v-for="(group, index) in currentActivities"
                        :date="group.date"
                        :items="group.items"
                        :key="index"
                        class="mb-4"
                    ></HistoryCardGroup>
                </div>
                <div
                    class="flex-1 text-center text-primary text-display-md"
                    v-if="activitiesLoading"
                >
                    <Spinner />
                </div>
                <div v-if="lastActivities.length === 0 && !activitiesLoading">
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
import HistoryFilterBar from "./HistoryFilterBar.vue";
import HistoryCardGroup from "./HistoryCardGroup.vue";
import HistoryEmpty from "./HistoryEmpty.vue";
import HistoryModerationPanel from "./HistoryModerationPanel.vue";

import { mapGetters } from "vuex";
import { listRegular } from "#helpers/api/userActivity";
import {
    get as getConfig,
    hasPermission,
    getPermission
} from "#helpers/api/config";

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
            canModerate: hasPermission("shantytown_comment.moderate"),
            locationName: "Inconnu",
            lastActivities: [],
            lastActivityDate: new Date(),
            activityFilter: [],
            loading: false,
            activitiesLoading: false,
            endOfActivities: false
        };
    },
    computed: {
        ...mapGetters({
            locations: "locations"
        }),
        currentActivities() {
            const groups = [];
            for (let i = 0, lastDate; i < this.lastActivities.length; i += 1) {
                const item = this.lastActivities[i];
                const date = new Date(item.date * 1000);
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
        activityFilter: {
            deep: true,
            handler: function() {
                this.load();
            }
        }
    },
    mounted() {
        this.loading = true;
        this.locationName = this.getLocationName();
        this.load();
        window.addEventListener("scroll", this.reachBottom);
    },
    beforeDestroy() {
        window.removeEventListener("scroll", this.reachBottom);
    },
    methods: {
        load() {
            this.setDate();
            this.lastActivities = [];
            this.endOfActivities = false;
            this.getActivities();
        },
        setDate() {
            const date = new Date();
            this.lastActivityDate = date.getTime() / 1000;
        },
        reachBottom() {
            let bottomOfWindow =
                document.documentElement.offsetHeight -
                    document.documentElement.scrollTop -
                    window.innerHeight ===
                0;
            if (
                bottomOfWindow &&
                !this.activitiesLoading &&
                !this.endOfActivities
            ) {
                this.getActivities();
            }
        },

        async getActivities() {
            this.activitiesLoading = true;
            if (!this.locationType) {
                this.$router.replace(this.defaultPath);
                return;
            }
            const tempLastActivities = await listRegular(
                this.lastActivityDate,
                this.activityFilter,
                10,
                this.locationType,
                this.locationCode
            );
            if (tempLastActivities.length > 0) {
                this.lastActivityDate = tempLastActivities.slice(-1)[0].date;
            }
            this.lastActivities = [
                ...this.lastActivities,
                ...tempLastActivities
            ];
            this.activitiesLoading = false;
            this.loading = false;
            if (tempLastActivities.length === 0) {
                // on arrive aux dernières activités
                this.endOfActivities = true;
            }
        },

        changeActivityFilter(list) {
            // on modifie le filtre des dernières activités, ce qui relancera automatiquement un getActivities() via les watchers
            this.activityFilter = list;
        },

        getLocationName() {
            const { user } = getConfig();
            const location = user.organization.location;
            if (location.type === "nation") {
                return "France";
            }
            return location[location.type]?.name || "Inconnu";
        },

        onLocationChange(location) {
            // on redirige vers la bonne URL (ce qui automatiquement relancera un getActivities() via les watchers)
            if (location === null) {
                this.routeTo("/activites/nation");
            } else {
                this.locationName = location.label;
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
