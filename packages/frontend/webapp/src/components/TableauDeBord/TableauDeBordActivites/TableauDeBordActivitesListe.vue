<template>
    <div>
        <h3 class="font-bold text-lg">Sur les 7 derniers jours</h3>
        <p
            v-if="splitActivities.currentWeek.length === 0"
            class="text-G700 italic"
        >
            Il n'y a eu aucune activité sur les 7 derniers jours
        </p>
        <TableauDeBordActivite
            v-else
            v-for="activity in splitActivities.currentWeek"
            :key="`${activity.entity}-${activity.action}-${activity.date}`"
            :activity="activity"
        />

        <h3 class="font-bold text-lg mt-8">Sur les 30 derniers jours</h3>
        <p
            v-if="splitActivities.previousMonth.length === 0"
            class="text-G700 italic"
        >
            Il n'y a eu aucune activité sur les 30 derniers jours
        </p>
        <TableauDeBordActivite
            v-else
            v-for="activity in splitActivities.previousMonth"
            :key="`${activity.entity}-${activity.action}-${activity.date}`"
            :activity="activity"
        />

        <footer class="mt-10 text-center">
            <Link to="/activites"> Voir toutes les activités </Link>
        </footer>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useDashboardStore } from "@/stores/dashboard.store";

import { Link } from "@resorptionbidonvilles/ui";
import TableauDeBordActivite from "./TableauDeBordActivite.vue";

const dashboardStore = useDashboardStore();
// Date d'il y a 7 jours à minuit
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
sevenDaysAgo.setHours(0, 0, 0, 0);
// date d'il y a exactement 30 jours à minuit
const aMonthAgo = new Date();
aMonthAgo.setDate(aMonthAgo.getDate() - 30);
aMonthAgo.setHours(0);
aMonthAgo.setMinutes(0);
aMonthAgo.setSeconds(0);
aMonthAgo.setMilliseconds(0);

const splitActivities = computed(() => {
    const filter = dashboardStore.activities.filter;

    return dashboardStore.formattedActivities.reduce(
        (acc, activity) => {
            let signature = `${activity.entity}_${activity.action}`;

            if (
                activity.action === "closing" &&
                activity.shantytown &&
                activity.shantytown.closedWithSolutions
            ) {
                signature += `_with_solutions`;
            }

            if (filter !== "all" && filter !== signature) {
                return acc;
            }

            if (activity.date >= sevenDaysAgo.getTime() / 1000) {
                acc.currentWeek.push(activity);
            } else if (activity.date >= aMonthAgo.getTime() / 1000) {
                acc.previousMonth.push(activity);
            }

            return acc;
        },
        {
            currentWeek: [],
            previousMonth: [],
        }
    );
});
</script>
