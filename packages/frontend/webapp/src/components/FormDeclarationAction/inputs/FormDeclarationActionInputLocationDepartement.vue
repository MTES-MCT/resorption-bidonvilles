<template>
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
import { computed } from "vue";
import labels from "../FormDeclarationAction.labels";
import { useUserStore } from "@/stores/user.store";

import { Select } from "@resorptionbidonvilles/ui";

const userStore = useUserStore();
const disabled = computed(() => {
    return userStore.departementsForActions.length === 1;
});
const info = computed(() => {
    if (userStore.departementsForActions.length === 1) {
        return "Cette information est déduite de votre territoire d'intervention et ne peut pas être modifiée";
    }

    return "Vous ne pouvez pas sélectionner un département en-dehors de votre territoire d'intervention";
});
</script>
