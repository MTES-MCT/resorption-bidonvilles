<template>
    <PrivateLayout>
        <PlanListSearchBar v-model="location" />

        <PrivateContainer v-if="state == 'loading'">
            <PlanListLoader></PlanListLoader>
        </PrivateContainer>

        <PrivateContainer v-else-if="state == 'loaded'">
            <PlanListHeader
                class="pt-10"
                :locationTitle="currentLocation.label"
            ></PlanListHeader>

            <div v-if="plansFilteredByLocation.length > 1">
                <Pagination
                    class="md:mt-0 mb-6 justify-end"
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
                    class="md:mt-0 mb-12 justify-end"
                    :currentPage="currentPage"
                    :nbPages="nbPages"
                    :onChangePage="onChangePage"
                />
            </div>

            <PlanListEmpty v-else />
        </PrivateContainer>

        <PrivateContainer v-else>
            <LoadingError :retry="load">{{ error }}</LoadingError>
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
import PlanCard from "./PlanListCard/PlanCard.vue";
import LoadingError from "#app/components/PrivateLayout/LoadingError.vue";
import { list } from "#helpers/api/plan";
import { get as getConfig, getPermission } from "#helpers/api/config";

const PER_PAGE = 10;

export default {
    components: {
        PlanListSearchBar,
        LoadingError,
        PrivateLayout,
        PrivateContainer,
        PlanListLoader,
        PlanListHeader,
        PlanCard,
        PlanListEmpty
    },
    data() {
        const { user } = getConfig();
        const permission = getPermission("plan.list");
        const hasNationalPermission = permission.allow_all === true;
        const data = {
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
            data.location = null;
        } else {
            data.location = { ...userLocation };
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
                .catch(error => {
                    this.error =
                        (error && error.user_message) ||
                        "Une erreur inconnue est survenue";
                    this.state = "error";
                });
        }
    },
    created() {
        this.load();
    },

    computed: {
        currentLocation() {
            return this.location && this.location.label
                ? this.location
                : {
                      id: null,
                      label: "France",
                      category: "Pays",
                      data: {
                          code: null,
                          type: "nation"
                      }
                  };
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
