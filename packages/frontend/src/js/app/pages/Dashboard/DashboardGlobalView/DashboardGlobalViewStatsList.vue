<template>
    <p v-if="isLoading"><Spinner /></p>

    <p v-else-if="error" class="text-red">
        <Icon icon="times-circle" />
        <span class="ml-2 font-bold"
            >Erreur lors de la collecte des données :</span
        >
        {{ error }}
    </p>

    <section v-else>
        <section class="grid grid-cols-5 gap-x-8 gap-y-6">
            <StatCard
                v-for="stat in stats"
                :cardStats="stat"
                :icon="stat.icon"
                :key="stat.label"
                :period="currentFilter"
            />
        </section>
        <router-link
            class="text-primary underline flex justify-center pt-10"
            :to="`statistiques`"
            v-if="hasPermission('stats.read')"
        >
            Voir plus de statistiques
        </router-link>
    </section>
</template>

<script>
import { mapGetters } from "vuex";
import StatCard from "./StatCard";
import { hasPermission } from "#helpers/api/config";

export default {
    components: {
        StatCard
    },
    async created() {
        if (!this.stats.length) {
            await this.$store.dispatch("fetchGlobalStats");
        }
        this.$store.commit("setDashboardGlobalStatsFilter", "month");
    },
    computed: {
        ...mapGetters({
            error: "dashboardGlobalStatsError",
            currentFilter: "dashboardGlobalStatsFilter",
            stats: "dashboardGlobalStats",
            isLoading: "dashboardGlobalStatsLoading"
        })
    },
    methods: {
        hasPermission
    }
};
</script>
