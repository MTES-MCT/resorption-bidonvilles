<template>
    <p class="font-bold">Les informations exportées par défaut sont :</p>
    <ul class="pl-5 list-disc">
        <li>Adresse et nom du site</li>
        <li>Caractéristiques du site</li>
        <li>Habitants</li>
        <li>Conditions de vie</li>
    </ul>
    <p class="mt-5 font-bold">
        Cochez les informations supplémentaires que vous souhaitez exporter :
    </p>
    <ul class="list-none">
        <li v-for="option in availableOptions" :key="option.id" class="pt-1">
            <Checkbox
                :value="option.id"
                :label="option.label"
                name="options"
                variant="checkbox"
                direction="col"
                :disabled="disabled"
            />
        </li>
    </ul>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import options from "./FicheSiteModaleExport.options";

import { Checkbox } from "@resorptionbidonvilles/ui";

const userStore = useUserStore();

const availableOptions = computed(() => {
    return options.filter(({ permission }) => {
        // on filtre par permission
        if (permission === undefined) {
            return true;
        }

        return userStore.hasPermission(
            `${permission.entity}.${permission.feature}`
        );
    });
});
</script>
