<template>
    <Warning v-if="disable" :autohide="false"
        >Vous n'avez pas le droit de modifier le champ "{{ labels.managers }}"
        (si besoin, veuillez contacter l'un des pilotes de l'action ou l'équipe
        de la plateforme)</Warning
    >
    <InputUsers
        name="managers"
        :label="labels.managers"
        info="Saisissez ci-dessous le nom d'un acteur pour l'ajouter à la liste"
        placeholder="Nom d'un utilisateur de la plateforme"
        usersOnly
        showMandatoryStar
        :disabled="disable"
    />
</template>

<script setup>
import { toRefs, defineProps } from "vue";
import InputUsers from "@/components/InputUsers/InputUsers.vue";
import { Warning } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationAction.labels";

const props = defineProps({
    disable: Boolean,
});
const { disable } = toRefs(props);
</script>
