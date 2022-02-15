<template>
    <p v-if="isLoading"><Spinner /></p>

    <p v-else-if="error" class="text-red">
        <Icon icon="times-circle" />
        <span class="ml-2 font-bold"
            >Erreur lors de la collecte des données :</span
        ><br />
        {{ error }}
    </p>

    <section v-else>
        <h1 class="font-bold text-lg mb-8">Cette semaine</h1>
        <p
            v-if="splitActivities.currentWeek.length === 0"
            class="text-G600 italic"
        >
            Il n'y a eu aucune activité cette semaine
        </p>
        <DashboardActivity
            v-else
            v-for="activity in splitActivities.currentWeek"
            :key="activity.date"
            :activity="activity"
        />

        <h1 class="font-bold text-lg mt-16 mb-8">Sur le dernier mois</h1>
        <p
            v-if="splitActivities.previousMonth.length === 0"
            class="text-G600 italic"
        >
            Il n'y a eu aucune activité sur le mois dernier
        </p>
        <DashboardActivity
            v-else
            v-for="activity in splitActivities.previousMonth"
            :key="activity.date"
            :activity="activity"
        />
    </section>
</template>

<script>
import { mapGetters } from "vuex";
import DashboardActivity from "./DashboardActivity";

export default {
    components: {
        DashboardActivity
    },

    data() {
        const monday = new Date();
        monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
        monday.setHours(0);
        monday.setMinutes(0);
        monday.setSeconds(0);
        monday.setMilliseconds(0);

        const aMonthAgo = new Date();
        aMonthAgo.setDate(aMonthAgo.getDate() - 31);
        aMonthAgo.setHours(0);
        aMonthAgo.setMinutes(0);
        aMonthAgo.setSeconds(0);
        aMonthAgo.setMilliseconds(0);

        return {
            monday: monday.getTime() / 1000,
            aMonthAgo: aMonthAgo.getTime() / 1000
        };
    },

    computed: {
        ...mapGetters({
            isLoading: "activitiesLoading",
            error: "activitiesError",
            activities: "activities"
        }),

        splitActivities() {
            return this.activities.reduce(
                (argAcc, activity) => {
                    const acc = { ...argAcc };

                    if (activity.date >= this.monday) {
                        acc.currentWeek.push(activity);
                    } else if (activity.date >= this.aMonthAgo) {
                        acc.previousMonth.push(activity);
                    } else {
                        acc.previousMonth.push(activity);
                    }

                    return acc;
                },
                {
                    currentWeek: [],
                    previousMonth: []
                }
            );
        }
    },

    created() {
        if (
            this.$store.state.activities.items.length === 0 ||
            this.$store.state.activities.loaded.locationType !== "nation"
        ) {
            this.$store.dispatch("fetchActivities", {
                locationType: "nation",
                locationCode: null
            });
        }
    }
};
</script>
