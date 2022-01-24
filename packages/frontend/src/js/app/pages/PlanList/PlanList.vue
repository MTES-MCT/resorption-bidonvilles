<template>
    <PrivateLayout>
        <PlanListSearchBar @locationChange="onLocationChange">
        </PlanListSearchBar>
        <PrivateContainer>
            <PlanListHeader :locationTitle="locationTitle"></PlanListHeader>
        </PrivateContainer>

        <PrivateContainer v-if="state == 'loading'">
            <PlanListLoader></PlanListLoader>
        </PrivateContainer>

        <PrivateContainer v-else-if="state == 'loaded'">
            <div v-if="plansFilteredByLocation.length > 1">
                <Pagination
                    class="md:mt-0 mb-6"
                    v-if="nbPages > 1"
                    :currentPage="currentPage"
                    :nbPages="nbPages"
                    :onChangePage="onChangePage"
                />
                <PlanCard
                    v-for="plan in plansFilteredByPage"
                    :key="plan.id"
                    :plan="plan"
                    class="mb-6"
                />
                <Pagination
                    class="md:mt-0 mb-6"
                    v-if="nbPages > 1"
                    :currentPage="currentPage"
                    :nbPages="nbPages"
                    :onChangePage="onChangePage"
                />
            </div>

            <div v-if="plansFilteredByLocation.length == 0">
                <PlanListEmpty></PlanListEmpty>
            </div>
        </PrivateContainer>

        <PrivateContainer v-else>
            <PlanListError :error="error" @retryLoading="retryLoading">
            </PlanListError>
        </PrivateContainer>
    </PrivateLayout>
</template>

<script>
import PlanListSearchBar from "./PlanListSearchBar.vue";
import PrivateLayout from "#app/components/PrivateLayout";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer.vue";
import PlanListLoader from "./PlanListLoader.vue";
import PlanListHeader from "./PlanListHeader/PlanListHeader.vue";
import PlanListEmpty from "./PlanListEmpty.vue";
import PlanListError from "./PlanListError.vue";
import PlanCard from "./PlanListCard/PlanCard.vue";
import { list } from "#helpers/api/plan";
import "vue-good-table/dist/vue-good-table.css";
import { get as getConfig, getPermission } from "#helpers/api/config";

const PER_PAGE = 10;

export default {
    components: {
        PlanListSearchBar,
        PrivateLayout,
        PrivateContainer,
        PlanListLoader,
        PlanListHeader,
        PlanCard,
        PlanListEmpty,
        PlanListError
    },
    data() {
        const { user } = getConfig();
        const permission = getPermission("plan.list");
        const hasNationalPermission = permission.geographic_level === "nation";
        const data = {
            locationTitle: null,
            defaultLocation: null,
            location: null
        };

        let userLocationType = user.organization.location.type;
        if (userLocationType === "epci" || userLocationType === "city") {
            userLocationType = "departement";
        }

        const userLocation = {
            id:
                userLocationType === "nation"
                    ? null
                    : user.organization.location[userLocationType].code,
            label:
                userLocationType === "nation"
                    ? "France"
                    : user.organization.location[userLocationType].name,
            category: userLocationType,
            data: {
                code:
                    userLocationType === "nation"
                        ? null
                        : user.organization.location[userLocationType].code,
                type: userLocationType
            }
        };

        if (hasNationalPermission !== true || userLocationType === "nation") {
            data.defaultLocation = { ...userLocation };
            data.location = null;
        } else {
            data.defaultLocation = {
                id: null,
                label: "France",
                category: "Pays",
                data: {
                    code: null,
                    type: "nation"
                }
            };
            data.location = { ...userLocation };
        }

        if (data.defaultLocation.data.type === "nation") {
            data.locationTitle = "National";
        } else {
            data.locationTitle = data.defaultLocation.label;
        }

        return Object.assign(data, {
            /**
             * List of plans
             *
             * @type {Array.<Plan>}
             */
            plans: [],

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
            currentPage: 1
        });
    },
    methods: {
        onChangePage(page) {
            this.currentPage = page;
        },
        onLocationChange(location) {
            this.location = location;
        },
        /**
         * Tries fetching the data from the API
         *
         * Please note that this cannot be done if the data has already been loaded
         * before.
         */
        load() {
            // loading data is forbidden if the component is already loading or loaded
            if ([null, "error"].indexOf(this.state) === -1) {
                return;
            }
            this.state = "loading";
            this.error = null;
            list()
                .then(plans => {
                    this.plans = plans;
                    this.state = "loaded";
                })
                .catch(({ user_message: error }) => {
                    this.error = error;
                    this.state = "error";
                });
        },

        /**
         * Alias to load(), for better readibility in the view
         *
         * @see load()
         */
        retryLoading() {
            this.load();
        }
    },
    created() {
        this.load();
    },

    computed: {
        currentLocation() {
            return this.location || this.defaultLocation;
        },
        plansFilteredByLocation() {
            return this.plans
                .filter(({ closed_at: closedAt }) => closedAt === null)
                .filter(plan => {
                    if (this.currentLocation.data.type === "nation") {
                        return true;
                    }

                    const l = plan[this.currentLocation.data.type];
                    return l && l.code === `${this.currentLocation.data.code}`;
                });
        },
        nbPages() {
            return Math.ceil(this.plansFilteredByLocation.length / PER_PAGE);
        },
        plansFilteredByPage() {
            return this.plansFilteredByLocation.slice(
                (this.currentPage - 1) * PER_PAGE,
                PER_PAGE * this.currentPage
            );
        }
    }
};
</script>
