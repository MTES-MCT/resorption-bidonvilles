<template>
    <FicheSousRubrique>
        <p class="font-bold mb-4">Propriétaires</p>
        <div class="flex flex-row sm:flex-col gap-2">
            <div class="flex flex-col sm:flex-row justify-between">
                <p class="font-bold">{{ ownerTitles.nom }}</p>
                <p class="font-bold">{{ ownerTitles.type }}</p>
            </div>
            <div
                v-for="owner in ownersList"
                :key="owner.ownerId"
                class="flex flex-col sm:flex-row justify-between"
            >
                <p class="break-words">
                    {{ owner.name || "non communiqué" }}
                </p>
                <p class="break-words">
                    {{ ownerType(owner.type) }}
                </p>
            </div>
        </div>
        <div v-if="!ownersList">
            <p class="break-words">Aucun propriétaire connu</p>
        </div>
    </FicheSousRubrique>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";
import { useConfigStore } from "@/stores/config.store";

import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const configStore = useConfigStore();

const ownersList = computed(() => {
    return town.value.owners?.filter((owner) => owner.active);
});

const ownerTitles = computed(() => {
    if (!ownersList.value) {
        return {};
    }
    return {
        nom:
            ownersList.value.length > 1
                ? "Noms des propriétaires"
                : "Nom du propriétaire",
        type:
            ownersList.value.length > 1
                ? "Types de propriétaires"
                : "Type de propriétaire",
    };
});

const ownerType = (ownerTypeId) => {
    const ownerType = configStore.config.owner_types.find(
        (type) => type.id === ownerTypeId
    );

    return ownerType ? ownerType.label : "Inconnu";
};
</script>
