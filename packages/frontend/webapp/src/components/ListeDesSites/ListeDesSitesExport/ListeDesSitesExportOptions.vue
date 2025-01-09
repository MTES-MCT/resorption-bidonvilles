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
                    option.id !== 'actors'
                "
                :checked="selectedOptions.includes(option.id)"
                @change="toggleOption(option.id)"
            />
        </li>
    </ul>
</template>

<script setup>
import { computed, defineProps, ref, toRefs, watch } from "vue";
import { useTownsStore } from "@/stores/towns.store";
import { useUserStore } from "@/stores/user.store";
import options from "./options";

import { Checkbox, Warning } from "@resorptionbidonvilles/ui";

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

const selectedOptions = ref(townsStore.exportOptions);

const toggleOption = (optionId) => {
    const index = selectedOptions.value.indexOf(optionId);
    if (index > -1) {
        selectedOptions.value.splice(index, 1);
    } else {
        selectedOptions.value.push(optionId);
    }
};

watch(selectedOptions, (newValue) => {
    townsStore.exportOptions = newValue;
});

const availableOptions = computed(() => {
    return options.filter(({ closedTowns, permission }) => {
        const isClosed = townsStore.filters.status === "close";

        // on filtre les options selon le statut fermé/ouvert du site
        if (closedTowns !== undefined && closedTowns !== isClosed) {
            return false;
        }

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
