<template>
    <PrivateLayout>
        <CovidHistorySearchbar @locationChange="onLocationChange">
        </CovidHistorySearchbar>

        <Private-container v-if="canSubmitHighComment">
            <CovidHistoryNewHighComment
                :class="['flex-1', 'pb-16', 'pt-16']"
                @addComment="submitHighCovidComment"
                id="newComment"
                :user="user"
                :allowedDepartements="allowedDepartements"
                :highCovidComment="highCovidComment"
            />
        </Private-container>

        <PrivateContainer v-if="this.state === 'loading'">
            <CovidHistoryLoader></CovidHistoryLoader>
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

            /**
             * The current state of the page
             *
             * One out of: 'loading', 'error', or 'loaded'
             *
             * @type {string|null}
             */
            state: null,

            /**
             *
             */
            covidTags,
            locationType: null,
            locationCode: null,
            loading: false,
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
                this.user.organization.location.type !== "nation" &&
                getPermission("covid_comment.list").geographic_level !==
                    "nation"
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
            const { user } = getConfig();
            const { geographic_level } = getPermission("shantytown.list");
            if (geographic_level === "nation") {
                this.locationType = "nation";
            } else {
                const { location } = user.organization;
                this.locationType = location.type;
                this.locationCode = location[location.type].code;
            }
        },
        load() {
            // loading data is forbidden if the component is already loading or loaded
            this.currentPage = 1;
            if ([null, "error"].indexOf(this.state) === -1) {
                return;
            }

            this.state = "loading";
            this.error = null;

            //
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
            Promise.all([this.getCovidMessages(), departementsPromise])
                .then(([userActivities, { departements }]) => {
                    this.activities = userActivities;
                    this.allowedDepartements = departements;
                    this.highCovidComment.data.departements = departements.map(
                        ({ code }) => code
                    );
                    this.state = "error";
                })
                .catch(({ user_message: error }) => {
                    this.error = error;
                    this.state = "error";
                });
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
                    this.state = null;
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
