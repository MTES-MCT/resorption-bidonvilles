<template>
    <Carto
        ref="carto"
        :layers="['Dessin', 'Satellite']"
        defaultLayer="Satellite"
        displaySkipMapLinks
    />
</template>

<script setup>
import Carto from "@/components/Carto/Carto.vue";
</script>
