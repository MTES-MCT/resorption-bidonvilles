<template>
    <PrivateLayout>
        <CovidHistorySearchbar @locationChange="onLocationChange">
        </CovidHistorySearchbar>

        <PrivateContainer v-if="canSubmitHighComment">
            <CovidHistoryNewHighComment
                :class="['flex-1', 'pb-16', 'pt-16']"
                @addComment="submitHighCovidComment"
                :user="user"
                :allowedDepartements="allowedDepartements"
                :highCovidComment="highCovidComment"
            />
        </PrivateContainer>

        <PrivateContainer v-if="this.loading">
            <CovidHistoryLoader></CovidHistoryLoader>
        </PrivateContainer>

        <PrivateContainer v-else-if="this.error !== null">
            <LoadingError>{{ this.error }}</LoadingError>
        </PrivateContainer>

        <PrivateContainer v-else class="py-6">
            <CovidHistoryHeaderLinks class="mb-6 mt-6">
            </CovidHistoryHeaderLinks>
            <CovidHistoryHeader class="mb-6">
                <template slot="filters">
                    <CovidHistoryHeaderTab
                        :active="filter === 'all'"
                        @click="onClickAllTab"
                        class="mr-8"
                        >Tous</CovidHistoryHeaderTab
                    >
                    <CovidHistoryHeaderTab
                        :active="filter === 'shantytowns'"
                        @click="onClickShantytownsTab"
                        class="mr-8"
                        >Commentaires "Sites"</CovidHistoryHeaderTab
                    >
                    <CovidHistoryHeaderTab
                        :active="filter === 'territory'"
                        @click="onClickTerritoryTab"
                        >Commentaires "Territoires"</CovidHistoryHeaderTab
                    >
                </template>
            </CovidHistoryHeader>
            <div v-if="activities.length > 0">
                <div>
                    <Pagination
                        class="md:mt-0 mb-2"
                        v-if="nbPages > 1"
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
                        class="md:mt-0 mb-2"
                        v-if="nbPages > 1"
                        :currentPage="currentPage"
                        :nbPages="nbPages"
                        :onChangePage="onChangePage"
                    />
                </div>
            </div>
            <div v-else>
                <CovidHistoryEmpty></CovidHistoryEmpty>
            </div>
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
import {
    getDepartementsForRegion,
    getDepartementsForEpci
} from "#helpers/api/geo";
import { create } from "#helpers/api/highCovidComment";
import { listRegular } from "#helpers/api/userActivity";
import covidTags from "../CovidHistory/covidTags";
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
             * List of departements
             *
             * @type {Array.<Departement>}
             */
            allowedDepartements: [],

            /**
             * List of selected departements
             *
             * @type {Object}
             */
            highCovidComment: {
                data: {},
                pending: false,
                error: null
            },

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
            covidTags,
            locationType: null,
            locationCode: null,
            currentPage: 1
        };
    },

    computed: {
        ...mapGetters({
            locations: "locations"
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
            return (
                this.allowedDepartements && this.allowedDepartements.length > 0
            );
        }
    },

    created() {
        this.initLocation();
        this.load();
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
                let departementsPromise;
                switch (this.user.organization.location.type) {
                    default:
                    case "nation":
                        departementsPromise = Promise.resolve({
                            departements: []
                        });
                        break;

                    case "region":
                        departementsPromise = getDepartementsForRegion(
                            this.user.organization.location.region.code
                        );
                        break;

                    case "epci":
                        departementsPromise = getDepartementsForEpci(
                            this.user.organization.location.epci.code
                        );
                        break;

                    case "departement":
                    case "city":
                        departementsPromise = Promise.resolve({
                            departements: [
                                this.user.organization.location.departement
                            ]
                        });
                }

                const [userActivities, { departements }] = await Promise.all([
                    this.getCovidMessages(),
                    departementsPromise
                ]);

                this.activities = userActivities;
                this.currentPage = 1;
                this.allowedDepartements = departements;
                this.highCovidComment.data.departements = departements.map(
                    ({ code }) => code
                );
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

        /**
         * Sets filter
         *
         * @param {'all'|'regular'|'high'} filter
         */
        setFilter(filter) {
            this.filter = filter;
        },

        /**
         *
         */
        submitHighCovidComment(data) {
            if (this.highCovidComment.pending) {
                return;
            }

            this.highCovidComment.pending = true;
            this.highCovidComment.error = null;

            create(data)
                .then(() => {
                    this.highCovidComment.pending = false;
                })
                .then(() => {
                    this.load();
                })
                .catch(({ user_message: message, fields }) => {
                    this.highCovidComment.pending = false;
                    this.highCovidComment.error = {
                        message,
                        fields
                    };
                });
        },

        onLocationChange(location) {
            if (location === null) {
                this.initLocation();
            } else {
                this.locationType = location.locationType;
                this.locationCode = location.code;
            }
            this.load();
        },

        onClickAllTab() {
            this.filter = "all";
            this.currentPage = 1;
        },

        onClickShantytownsTab() {
            this.filter = "shantytowns";
            this.currentPage = 1;
        },

        onClickTerritoryTab() {
            this.filter = "territory";
            this.currentPage = 1;
        }
    }
};
</script>
