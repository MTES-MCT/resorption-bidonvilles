<template>
    <InputStructure
        name="Structures"
        :label="label"
        placeholder="Nom de votre Structure, Collectivité territoriale, Association, Autre ?"
        showCategory
        showMandatoryStar
    />
</template>

<script setup>
import InputStructure from "@/components/InputStructure/InputStructure.vue";
</script>
