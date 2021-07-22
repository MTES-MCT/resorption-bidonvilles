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
import store from "#app/store";

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
                return store.state.activities.filters.activityTypes;
            },
            set(value) {
                store.commit("setActivityTypesFilter", value);
            }
        }
    }
};
</script>
