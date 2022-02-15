<template>
    <p v-if="isLoading"><Spinner /></p>

    <p v-else-if="error" class="text-red">
        <Icon icon="times-circle" />
        <span class="ml-2 font-bold"
            >Erreur lors de la collecte des données :</span
        >
        {{ error }}
    </p>

    <p
        v-else-if="
            rawShantytowns.length === 0 && currentFilter === 'my_shantytowns'
        "
        class="text-primary p-4 bg-blue200"
    >
        Retrouvez ici les sites sur lesquels vous intervenez le plus souvent en
        vous déclarant intervenant(e) directement depuis la fiche des sites
        concernés.
    </p>

    <p v-else-if="rawShantytowns.length === 0" class="text-G600 italic">
        Aucune donnée à afficher
    </p>

    <section v-else>
        <section class="grid grid-cols-3 gap-x-8 gap-y-6">
            <ShantytownThumbnail
                v-for="shantytown in pageContent"
                :key="shantytown.id"
                :shantytown="shantytown"
            />
        </section>
        <Pagination
            class="mt-10 justify-center"
            :currentPage="currentPage"
            :nbPages="nbPages"
            :onChangePage="onChangePage"
        />
    </section>
</template>

<script>
import { mapGetters } from "vuex";
import ShantytownThumbnail from "../ShantytownThumbnail/ShantytownThumbnail";

const ITEMS_PER_PAGE = 6;

export default {
    components: {
        ShantytownThumbnail
    },
    async created() {
        if (!this.$store.state.towns.data.length) {
            await this.$store.dispatch("fetchTowns");
        }

        if (
            this.myShantytowns.length === 0 &&
            this.currentFilter === "my_shantytowns"
        ) {
            this.$store.commit(
                "setDashboardShantytownsFilter",
                "new_shantytowns"
            );
        }
    },
    computed: {
        ...mapGetters({
            isLoading: "townsLoading",
            error: "townsError",
            currentFilter: "dashboardShantytownsFilter",
            myShantytowns: "dashboardMyShantytowns",
            rawShantytowns: "dashboardContent",
            pageContent: "dashboardPageContent",
            sort: "dashboardShantytownsSort",
            currentPage: "dashboardShantytownsCurrentPage"
        }),
        nbPages() {
            return Math.ceil(this.rawShantytowns.length / ITEMS_PER_PAGE);
        },
        sortFn() {
            if (this.sort === "cityName") {
                return (a, b) => {
                    if (a.city.name < b.city.name) {
                        return -1;
                    }
                    if (a.city.name > b.city.name) {
                        return 1;
                    }
                    return 0;
                };
            }
            return (a, b) => {
                return b[this.sort] - a[this.sort];
            };
        },
        orderedShantytowns() {
            return [...this.rawShantytowns].sort(this.sortFn);
        },
        pageContent() {
            return this.orderedShantytowns.slice(
                (this.currentPage - 1) * ITEMS_PER_PAGE,
                this.currentPage * ITEMS_PER_PAGE
            );
        }
    },
    methods: {
        onChangePage(page) {
            this.$store.commit(
                "setDashboardShantytownsPage",
                Math.min(Math.max(0, page), this.nbPages)
            );
        }
    }
};
</script>
