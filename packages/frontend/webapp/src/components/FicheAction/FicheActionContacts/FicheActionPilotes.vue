<template>
    <FicheSousRubrique :border="false" :marginTop="false" class="flex flex-col">
        <span class="font-bold">Pilote{{ users.length > 1 ? "s" : "" }}</span>
        <CarteUtilisateur
            class="my-2"
            v-for="user in users"
            :key="user.id"
            :user="user"
            :linkToUser="false"
            includeOrganization
        />
        <div v-if="users.length === 0" class="flex flex-col gap-2">
            <p class="italic">Aucun pilote assigné à cette action.</p>
            <DsfrButton
                label="Demander un pilote"
                @click="requestPilot"
                iconRight
                :disabled="loading || pilotHasBeenRequested"
                :icon="
                    loading
                        ? {
                              name: 'ri-refresh-line',
                              animation: 'spin',
                          }
                        : null
                "
            />
        </div>
    </FicheSousRubrique>
</template>

<script setup>
import { defineProps, toRefs, computed, ref } from "vue";

import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";
import CarteUtilisateur from "@/components/CarteUtilisateur/CarteUtilisateur.vue";
import { useActionsStore } from "@/stores/actions.store";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
const loading = ref(false);
const actionsStore = useActionsStore();
const users = computed(() => {
    return action.value.managers.map(({ users }) => users).flat();
});
const pilotHasBeenRequested = computed(() => {
    return actionsStore.requestedPilotsForActions.includes(action.value.id);
});

const requestPilot = async () => {
    loading.value = true;
    await actionsStore.requestPilotAction(action.value.id);
    loading.value = false;
};
</script>
