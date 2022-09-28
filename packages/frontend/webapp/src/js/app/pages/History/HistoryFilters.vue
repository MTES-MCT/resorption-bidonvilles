<template>
    <div>
        Filtrer par<br />
        <CustomFilter
            title="Type d'activités"
            :options="options.activityTypes"
            :disabled="$store.state.activities.loading"
            v-model="activityFilter"
        />
    </div>
</template>

<script>
export default {
    data() {
        return {
            options: {
                activityTypes: [
                    {
                        label: "Nouveaux sites",
                        value: "shantytownCreation"
                    },
                    {
                        label: "Fermetures de sites",
                        value: "shantytownClosing"
                    },
                    {
                        label: "Modifications de sites",
                        value: "shantytownUpdate"
                    },
                    {
                        label: "Nouveaux messages site",
                        value: "shantytownComment_highCovidComment"
                    },
                    {
                        label: "Nouveaux messages action",
                        value: "planComment"
                    },
                    {
                        label: "Nouveaux utilisateurs",
                        value: "user"
                    }
                ]
            }
        };
    },

    computed: {
        activityFilter: {
            get() {
                return this.$store.state.activities.filters.activityTypes;
            },
            set(value) {
                this.$store.commit("setActivityTypesFilter", value);
            }
        }
    }
};
</script>
