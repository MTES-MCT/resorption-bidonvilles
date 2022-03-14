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
                { id: "all", label: "Toutes les activités" },
                { id: "shantytown_creation", label: "Nouveaux sites" },
                { id: "shantytown_closing", label: "Sites fermés" },
                {
                    id: "shantytown_closing_with_solutions",
                    label: "Sites résorbés"
                },
                { id: "user_creation", label: "Nouveaux utilisateurs" },
                { id: "comment_creation", label: "Nouveaux messages" }
            ]
        };
    }
};
</script>
