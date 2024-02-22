<template>
    <InputCollectiviteTerritoriale
        name="territorial_collectivity"
        :label="label"
        placeholder="Nom de la commune, epci, département, ou région ?"
        showCategory
        showMandatoryStar
    />
</template>

<script setup>
import InputCollectiviteTerritoriale from "@/components/InputCollectiviteTerritoriale/InputCollectiviteTerritoriale.vue";
</script>
