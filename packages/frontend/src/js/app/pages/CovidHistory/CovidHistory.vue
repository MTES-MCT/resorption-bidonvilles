<template>
    <PrivateLayout>
        <CovidHistorySearchbar @locationChange="onLocationChange">
        </CovidHistorySearchbar>

        <PrivateContainer>
            <CovidHistoryHeaderLinks class="mt-6" />
            <CovidHistoryNewHighComment
                v-if="canSubmitHighComment"
                class="my-6"
            />
        </PrivateContainer>

        <PrivateContainer v-if="this.loading">
            <CovidHistoryLoader></CovidHistoryLoader>
        </PrivateContainer>

        <PrivateContainer v-else-if="this.error !== null">
            <LoadingError>{{ this.error }}</LoadingError>
        </PrivateContainer>

        <PrivateContainer v-else class="py-6">
            <CovidHistoryHeader class="mb-6" v-if="activities.length > 0">
                <CovidHistoryHeaderTab
                    :active="filter === 'all'"
                    @click="setFilter('all')"
                    class="mr-8"
                    >Tous</CovidHistoryHeaderTab
                >
                <CovidHistoryHeaderTab
                    :active="filter === 'shantytowns'"
                    @click="setFilter('shantytowns')"
                    class="mr-8"
                    >Messages "Sites"</CovidHistoryHeaderTab
                >
                <CovidHistoryHeaderTab
                    :active="filter === 'territory'"
                    @click="setFilter('territory')"
                    >Messages "Territoires"</CovidHistoryHeaderTab
                >
            </CovidHistoryHeader>

            <div v-if="activities.length > 0">
                <Pagination
                    class="md:mt-0 mb-6 justify-end"
                    :currentPage="currentPage"
                    :nbPages="nbPages"
                    :onChangePage="onChangePage"
                />
                <CovidHistoryCardGroup
                    v-for="(group, index) in currentActivities"
                    :date="group.date"
                    :items="group.items"
                    :key="index"
                    class="mb-4"
                ></CovidHistoryCardGroup>
                <Pagination
                    class="mt-8 justify-end"
                    :currentPage="currentPage"
                    :nbPages="nbPages"
                    :onChangePage="onChangePage"
                />
            </div>

            <CovidHistoryEmpty v-else></CovidHistoryEmpty>
        </PrivateContainer>
    </PrivateLayout>
</template>

<script>
import CovidHistoryHeaderLinks from "./CovidHistoryHeaders/CovidHistoryHeaderLinks.vue";
import CovidHistoryLoader from "./CovidHistoryLoader.vue";
import CovidHistoryHeader from "./CovidHistoryHeaders/CovidHistoryHeader.vue";
import CovidHistoryHeaderTab from "./CovidHistoryHeaders/CovidHistoryHeaderTab.vue";
import CovidHistoryCardGroup from "./CovidHistoryCardGroup.vue";
import CovidHistoryEmpty from "./CovidHistoryEmpty.vue";
import CovidHistoryNewHighComment from "./CovidHistoryNewHighComment.vue";
import PrivateLayout from "#app/components/PrivateLayout";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer.vue";
import LoadingError from "#app/components/PrivateLayout/LoadingError.vue";
import CovidHistorySearchbar from "./CovidHistorySearchbar.vue";
import { get as getConfig, getPermission } from "#helpers/api/config";
import { listRegular } from "#helpers/api/userActivity";
import { mapGetters } from "vuex";

const PER_PAGE = 10;

export default {
    components: {
        CovidHistoryHeaderLinks,
        PrivateLayout,
        PrivateContainer,
        LoadingError,
        CovidHistoryLoader,
        CovidHistoryHeader,
        CovidHistoryHeaderTab,
        CovidHistorySearchbar,
        CovidHistoryCardGroup,
        CovidHistoryEmpty,
        CovidHistoryNewHighComment
    },

    data() {
        const { user } = getConfig();

        return {
            /**
             * Current user
             *
             * @type {User}
             */
            user,

            /**
             * Current filter
             *
             * @type {'all'|'shantytowns'|'territory'}
             */
            filter: "all",

            /**
             * List of activities
             *
             * @type {Array.<UserActivity>}
             */
            activities: [],

            /**
             * The error's user message
             *
             * Obivously, null if there is no error
             *
             * @type {string|null}
             */
            error: null,

            loading: false,

            /**
             *
             */
            locationType: null,
            locationCode: null,
            currentPage: 1
        };
    },

    computed: {
        ...mapGetters({
            locations: "locations",
            allowedDepartements: "allowedDepartements"
        }),
        nbPages() {
            return Math.ceil(this.filteredActivities.length / PER_PAGE);
        },
        filteredActivities() {
            if (this.filter === "all") {
                return this.activities;
            }

            return this.activities.filter(activity => {
                if (this.filter === "shantytowns") {
                    return activity.comment && !!activity.comment.covid;
                }

                return !!activity.highCovidComment;
            });
        },

        filteredActivitiesByPage() {
            return this.filteredActivities.slice(
                (this.currentPage - 1) * PER_PAGE,
                PER_PAGE * this.currentPage
            );
        },

        currentActivities() {
            const groups = [];
            for (
                let i = 0, lastDate;
                i < this.filteredActivitiesByPage.length;
                i += 1
            ) {
                const item = this.filteredActivitiesByPage[i];
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
        canSubmitHighComment() {
            return this.allowedDepartements.length > 0;
        }
    },

    created() {
        this.initLocation();
        this.load();
        this.$store.dispatch("fetchAllowedDepartements");
    },

    methods: {
        getCovidMessages() {
            const date = new Date();
            return listRegular(
                date.getTime() / 1000,
                ["highCovidComment", "shantytownComment", "onlyCovid"],
                -1,
                this.locationType,
                this.locationCode
            );
        },
        initLocation() {
            const permission = getPermission("shantytown.list");
            if (permission && permission.allow_all === true) {
                this.locationType = "nation";
            } else {
                const { location } = this.user.organization;
                this.locationType = location.type;
                this.locationCode = location[location.type].code;
            }
        },
        async load() {
            if (this.loading === true) {
                return;
            }

            this.loading = true;
            this.error = null;

            //
            try {
                const userActivities = await this.getCovidMessages();
                this.activities = userActivities;
                this.currentPage = 1;
            } catch (error) {
                this.error =
                    error.user_message || "Une erreur inconnue est survenue";
            }

            this.loading = false;
        },

        onChangePage(page) {
            this.currentPage = page;
        },

        /**
         *
         */
        onRowClick(row) {
            if (!row.shantytown) {
                return;
            }

            this.$router.push(`/site/${row.shantytown}`);
        },

        setFilter(filter) {
            this.filter = filter;
            this.currentPage = 1;
        },

        onLocationChange(location) {
            if (location === null) {
                this.initLocation();
            } else {
                this.locationType = location.locationType;
                this.locationCode = location.code;
            }
            this.load();
        }
    }
};
</script>
