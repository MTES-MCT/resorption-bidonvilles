<template>
    <ViewHeader icon="tent">
        <template v-slot:title>Liste des sites</template>
        <template v-slot:description
            >Consultez et gérez la liste des sites</template
        >
        <template v-slot:actions>
            <ListeDesSitesBoutons />
        </template>
    </ViewHeader>
</template>

<script setup>
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import ListeDesSitesBoutons from "./ListeDesSitesBoutons.vue";
</script>
