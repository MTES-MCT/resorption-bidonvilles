<template>
    <InputUsers
        name="managers"
        :label="labels.managers"
        info="Saisissez ci-dessous le nom d'un acteur pour l'ajouter à la liste"
        placeholder="Nom d'un utilisateur de la plateforme"
        usersOnly
        showMandatoryStar
    />
</template>

<script setup>
import InputUsers from "@/components/InputUsers/InputUsers.vue";
import labels from "../FormDeclarationAction.labels";
</script>
