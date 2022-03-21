<template>
    <nav class="flex flex-col">
        <DashboardActivitiesFilter
            v-for="section in sections"
            :key="section.id"
            v-bind="section"
        />
    </nav>
</template>

<script>
import DashboardActivitiesFilter from "./DashboardActivitiesFilter";

export default {
    components: {
        DashboardActivitiesFilter
    },

    data() {
        return {
            sections: [
                {
                    id: "all",
                    label: "Toutes les activités",
                    track_id: "toutes les activités"
                },
                {
                    id: "shantytown_creation",
                    label: "Nouveaux sites",
                    track_id: "nouveaux sites"
                },
                {
                    id: "shantytown_closing",
                    label: "Sites fermés",
                    track_id: "sites fermés"
                },
                {
                    id: "shantytown_closing_with_solutions",
                    label: "Sites résorbés",
                    track_id: "sites résorbés"
                },
                {
                    id: "user_creation",
                    label: "Nouveaux utilisateurs",
                    track_id: "nouveaux utilisateurs"
                },
                {
                    id: "comment_creation",
                    label: "Nouveaux messages",
                    track_id: "nouveaux messages"
                }
            ]
        };
    }
};
</script>
