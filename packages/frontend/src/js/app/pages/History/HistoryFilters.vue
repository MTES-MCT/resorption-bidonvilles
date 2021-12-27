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
            activityFilter: [],
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
                        label: "Nouveaux messages",
                        value: "shantytownComment_highCovidComment"
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
        activityTypes: {
            get() {
                return this.activityFilter;
            },
            set(value) {
                this.activityFilter = value;
                this.$emit("changeActivityFilter", value);
            }
        }
    }
};
</script>
