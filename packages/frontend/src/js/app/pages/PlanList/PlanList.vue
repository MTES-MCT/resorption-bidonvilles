<template>
    <PrivateLayout>
        <PlanListSearchBar />

        <PrivateContainer v-if="state == 'loading'">
            <PlanListLoader></PlanListLoader>
        </PrivateContainer>

        <PrivateContainer v-else-if="state == 'loaded'">
            <PlanListHeader class="pt-10" />

            <div v-if="pageContent.length >= 1">
                <div class="flex justify-between items-end mb-4">
                    <PlanFilters class="mb-1" />
                    <Pagination
                        class="md:mt-0 justify-end"
                        :currentPage="currentPage"
                        :nbPages="nbPages"
                        :onChangePage="onChangePage"
                    />
                </div>
                <PlanCard
                    v-for="plan in pageContent"
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
import PlanFilters from "./PlanFilters.vue";
import LoadingError from "#app/components/PrivateLayout/LoadingError.vue";
import { mapGetters } from "vuex";

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
        PlanListEmpty,
        PlanFilters
    },

    methods: {
        onChangePage(page) {
            this.$store.commit("setPlansPage", page);
        },

        load() {
            if (this.plans.length === 0) {
                this.$store.dispatch("fetchPlans");
            }
        }
    },

    created() {
        this.load();
    },

    computed: {
        ...mapGetters({
            plans: "plansItems",
            error: "plansError",
            state: "plansState",
            currentPage: "plansCurrentPage",
            location: "plansLocationFilter"
        }),
        nbPages() {
            return Math.ceil(this.plans.length / PER_PAGE);
        },
        pageContent() {
            return this.plans.slice(
                (this.currentPage - 1) * PER_PAGE,
                PER_PAGE * this.currentPage
            );
        }
    }
};
</script>
