<template>
    <div class="flex flex-col ml-4">
        <TableauDeBordFiltre
            v-for="section in sections"
            :key="section.id"
            v-bind="section"
        />
    </div>
</template>

<script setup>
import TableauDeBordFiltre from "./TableauDeBordFiltre.vue";

const sections = [
    {
        id: "comment_creation",
        label: "Nouveaux messages",
        track_id: "nouveaux messages",
    },
    {
        id: "shantytown_creation",
        label: "Nouveaux sites",
        track_id: "nouveaux sites",
    },
    {
        id: "shantytown_closing",
        label: "Sites fermés",
        track_id: "sites fermés",
    },
    {
        id: "shantytown_closing_with_solutions",
        label: "Sites résorbés",
        track_id: "sites résorbés",
    },
    {
        id: "user_creation",
        label: "Nouveaux utilisateurs",
        track_id: "nouveaux utilisateurs",
    },
    {
        id: "question_creation",
        label: "Nouvelles questions",
        track_id: "nouvelles questions",
    },
    {
        id: "answer_creation",
        label: "Nouvelles réponses",
        track_id: "nouvelles réponses",
    },
    {
        id: "all",
        label: "Toutes les activités",
        track_id: "toutes les activités",
    },
];
</script>
