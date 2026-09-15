<template>
    <InputUsers
        name="target"
        :label="labels.target"
        info="Saisissez ci-dessous le nom d'une structure ou d'un acteur pour l'ajouter à la liste"
        placeholder="Nom d'une structure ou d'un utilisateur"
        :departement="departement"
    />
</template>

<script setup>
import { toRefs } from "vue";
import InputUsers from "@/components/InputUsers/InputUsers.vue";
import labels from "../FicheSiteJournalFormNouveauMessage.labels";

const props = defineProps({
    departement: String,
});
const { departement } = toRefs(props);
</script>
