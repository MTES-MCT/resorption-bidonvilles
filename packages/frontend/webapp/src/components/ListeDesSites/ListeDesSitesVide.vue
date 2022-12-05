<template>
    <ViewError variant="vide">
        <template v-slot:title>Aucun résultat pour cette recherche</template>
        <template v-slot:code>Filtres ou recherche</template>
        <template v-slot:content
            >Il semblerait qu'il n'existe aucun site répondant à vos
            critères.</template
        >
        <template v-slot:actions>&nbsp;</template>
    </ViewError>
</template>

<script setup>
import ViewError from "@/components/ViewError/ViewError.vue";
</script>
