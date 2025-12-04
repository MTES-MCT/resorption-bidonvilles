<template>
    <p class="mt-5 font-bold">Les informations exportées par défaut sont :</p>
    <ul class="pl-5 list-disc">
        <li>Localisation</li>
        <li>Caractéristiques du site</li>
        <li>Le site est-il concerné par une action financée ?</li>
        <li>Habitants</li>
    </ul>
    <p class="mt-5 font-bold">
        Cochez les informations supplémentaires que vous souhaitez exporter :
    </p>
    <p v-if="disabled">
        <Warning :autohide="false"
            >Les options supplémentaires ne sont pas permises pour un export
            d'une date passée</Warning
        >
    </p>
    <ul class="list-none">
        <li v-for="option in availableOptions" :key="option.id" class="pt-1">
            <Checkbox
                :value="option.id"
                :label="option.label"
                name="options"
                variant="checkbox"
                direction="col"
                :disabled="
                    disabled &&
                    option.id !== 'living_conditions' &&
                    option.id !== 'actors' &&
                    option.id !== 'resorption_phases'
                "
                :checked="selectedOptions.includes(option.id)"
                @change="toggleOption(option.id)"
            />
        </li>
    </ul>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";
import { useTownsStore } from "@/stores/towns.store";
import { useUserStore } from "@/stores/user.store";
import { useConfigStore } from "@/stores/config.store";
import options from "./options";
import { Checkbox, Warning } from "@resorptionbidonvilles/ui";
import departementsInResorptionPhases from "@/utils/departements_in_resorption_phases";

const props = defineProps({
    disabled: {
        type: Boolean,
        required: false,
        default: true,
    },
});

const { disabled } = toRefs(props);

const townsStore = useTownsStore();
const userStore = useUserStore();
const configStore = useConfigStore();

const selectedOptions = townsStore.exportOptions;

const toggleOption = (optionId) => {
    const index = selectedOptions.indexOf(optionId);
    if (index > -1) {
        selectedOptions.splice(index, 1);
    } else {
        selectedOptions.push(optionId);
    }
};

const locationIncludesResorptionDepartement = computed(() => {
    const location = townsStore.filters.location;

    // Si aucun filtre de localisation, on affiche l'option
    if (!location) {
        return true;
    }

    // Si le filtre est un département spécifique
    if (location.typeUid === "departement") {
        const deptCode = location.code;
        return departementsInResorptionPhases.includes(
            Number.parseInt(deptCode, 10)
        );
    }

    // Si le filtre est une région spécifique, vérifier si elle contient un département concerné
    if (location.typeUid === "region") {
        const allDepartements = configStore.config?.departements || [];
        const regionCode = location.code;

        // Vérifier si au moins un département de cette région est concerné
        return allDepartements.some(
            (dept) =>
                dept.region === regionCode &&
                departementsInResorptionPhases.includes(
                    Number.parseInt(dept.code, 10)
                )
        );
    }

    // Pour les zones plus larges (EPCI, nation, metropole, outremer),
    // on affiche l'option car elles peuvent contenir les départements concernés
    return ["epci", "nation", "metropole", "outremer"].includes(
        location.typeUid
    );
});

const availableOptions = computed(() => {
    const isNationalAdmin =
        userStore.user?.intervention_areas?.is_national === true;

    return options.filter(({ id, closedTowns, permission }) => {
        const isClosed = townsStore.filters.status === "close";

        if (closedTowns !== undefined && closedTowns !== isClosed) {
            return false;
        }

        // Filtre spécifique pour les phases de résorption : vérifier le territoire
        if (id === "resorption_phases") {
            if (!locationIncludesResorptionDepartement.value) {
                return false;
            }
        }

        if (permission === undefined) {
            return true;
        }

        // Les admins nationaux ont accès à toutes les options
        if (isNationalAdmin) {
            return true;
        }

        return userStore.hasPermission(
            `${permission.entity}.${permission.feature}`
        );
    });
});
</script>
