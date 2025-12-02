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
import { computed, defineProps, toRefs } from "vue";
import { useUserStore } from "@/stores/user.store";
import options from "./FicheSiteModaleExport.options";
import departementsInResorptionPhases from "@/utils/departements_in_resorption_phases";

import { Checkbox } from "@resorptionbidonvilles/ui";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const userStore = useUserStore();

const availableOptions = computed(() => {
    const isNationalAdmin =
        userStore.user?.intervention_areas?.is_national === true;

    return options.filter(({ id, permission }) => {
        // Filtre spécifique pour les phases de résorption
        if (id === "resorption_phases") {
            // Vérifier si le site est dans un département concerné
            const isInExperimentDepartement =
                departementsInResorptionPhases.includes(
                    Number.parseInt(town.value.departement.code, 10)
                );

            if (!isInExperimentDepartement) {
                return false;
            }

            // Les admins nationaux ont accès sans permission explicite
            if (isNationalAdmin) {
                return true;
            }

            // Sinon vérifier la permission
            if (permission) {
                return userStore.hasPermission(
                    `${permission.entity}.${permission.feature}`
                );
            }

            return false;
        }

        // Filtre par permission pour les autres options
        if (permission === undefined) {
            return true;
        }

        // Les admins nationaux ont toutes les permissions
        if (isNationalAdmin) {
            return true;
        }

        return userStore.hasPermission(
            `${permission.entity}.${permission.feature}`
        );
    });
});
</script>
