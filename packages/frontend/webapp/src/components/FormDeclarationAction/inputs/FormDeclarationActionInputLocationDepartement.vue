<template>
    <Warning v-if="disable" :autohide="false"
        >Vous n'avez pas le droit de modifier le champ "{{
            labels.location_departement
        }}" (si besoin, veuillez contacter l'un des pilotes de l'action ou
        l'équipe de la plateforme)</Warning
    >
    <Select
        name="location_departement"
        :label="labels.location_departement"
        :info="info"
        :disabled="disabled"
        showMandatoryStar
    >
        <option
            v-for="option in userStore.departementsForActions"
            :key="option.code"
            :value="option.code"
        >
            {{ option.code }} — {{ option.name }}
        </option>
    </Select>
</template>

<script setup>
import { computed, toRefs, defineProps } from "vue";
import labels from "../FormDeclarationAction.labels";
import { useUserStore } from "@/stores/user.store";

import { Select, Warning } from "@resorptionbidonvilles/ui";

const props = defineProps({
    disable: Boolean,
});
const { disable } = toRefs(props);

const userStore = useUserStore();
const disabled = computed(() => {
    return (
        userStore.departementsForActions.length === 1 || disable.value === true
    );
});
const info = computed(() => {
    if (userStore.departementsForActions.length === 1) {
        return "Cette information est déduite de votre territoire d'intervention et ne peut pas être modifiée";
    }

    return "Vous ne pouvez pas sélectionner un département en-dehors de votre territoire d'intervention";
});
</script>
