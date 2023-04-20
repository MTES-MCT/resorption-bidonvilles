<template>
    <p class="mt-5 font-bold">Les informations exportées par défaut sont :</p>
    <ul class="pl-5 list-disc">
        <li>Localisation</li>
        <li>Caractéristiques du site</li>
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
                v-model="checkedOptions"
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
import { computed, toRefs } from "vue";
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

const checkedOptions = computed({
    get() {
        return townsStore.exportOptions;
    },
    set(newValue) {
        townsStore.exportOptions = newValue;
    },
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
