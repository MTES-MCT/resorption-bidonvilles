<template>
    <div>
        Filtrer par<br />
        <CustomFilter
            title="Type d'activités"
            :options="options.activityTypes"
            v-model="activityTypes"
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
                        value: "shantytown-creation"
                    },
                    {
                        label: "Fermetures de sites",
                        value: "shantytown-closing"
                    },
                    {
                        label: "Modifications de sites",
                        value: "shantytown-update"
                    },
                    {
                        label: "Nouveaux messages",
                        value: "comment-creation"
                    }
                ]
            }
        };
    },

    computed: {
        activityTypes: {
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
