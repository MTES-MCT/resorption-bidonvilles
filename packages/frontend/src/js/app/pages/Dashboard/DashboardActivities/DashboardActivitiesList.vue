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
        <h1 class="font-bold text-lg">Sur les 7 derniers jours</h1>
        <p
            v-if="splitActivities.currentWeek.length === 0"
            class="text-G600 italic"
        >
            Il n'y a eu aucune activité sur les 7 derniers jours
        </p>
        <DashboardActivity
            v-else
            v-for="activity in splitActivities.currentWeek"
            :key="`${activity.entity}-${activity.action}-${activity.date}`"
            :activity="activity"
        />

        <h1 class="font-bold text-lg mt-8">Sur les 30 derniers jours</h1>
        <p
            v-if="splitActivities.previousMonth.length === 0"
            class="text-G600 italic"
        >
            Il n'y a eu aucune activité sur les 30 derniers jours
        </p>
        <DashboardActivity
            v-else
            v-for="activity in splitActivities.previousMonth"
            :key="`${activity.entity}-${activity.action}-${activity.date}`"
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
        aMonthAgo.setDate(aMonthAgo.getDate() - 30);
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
            activities: "dashboard/activities"
        }),

        user() {
            return this.$store.state.config.configuration.user;
        },

        splitActivities() {
            const { filter } = this.$store.state.dashboard.dashboard.activities;

            return this.activities.reduce(
                (argAcc, activity) => {
                    const acc = { ...argAcc };
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

                    if (activity.date >= this.monday) {
                        acc.currentWeek.push(activity);
                    } else if (activity.date >= this.aMonthAgo) {
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

    mounted() {
        this.load();
    },

    methods: {
        load() {
            const { type } = this.user.organization.location;
            let code = null;

            if (type !== "nation") {
                ({ code } = this.user.organization.location[type]);
            }

            this.$store.dispatch("fetchActivities", {
                location: {
                    locationType: type,
                    locationCode: code
                },
                maxDate: this.aMonthAgo * 1000,
                numberOfActivities: -1
            });
        }
    }
};
</script>
