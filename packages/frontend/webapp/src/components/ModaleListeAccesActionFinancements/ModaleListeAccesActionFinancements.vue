<template>
    <ModaleListeAcces ref="modale" :wording="wording" :loadFn="fetch" />
</template>

<script setup>
import { ref, toRefs, watch, computed } from "vue";
import ModaleListeAcces from "@/components/ModaleListeAcces/ModaleListeAcces.vue";
import { getActionFinancementsReadersByAction } from "@/api/actions.api";
import { getActionsFinancesdReaders } from "@/api/action_finances_readers.api";

const props = defineProps({
    actionId: Number,
    managers: Array,
    departement: String,
    future: Boolean,
});
const { actionId, departement, managers, future } = toRefs(props);
const modale = ref(null);

const wording = computed(() => {
    if (future.value === true) {
        return {
            title: () =>
                "Qui aura accès aux données sur les financements de l'action ?",
            emptyList: () =>
                "Seuls les utilisateurs en préfecture, DDETS / DREETS et les services en charge de cette action auront accès aux données sur les financements.",
            fullList: (numberOfUsers) =>
                `${
                    numberOfUsers > 1 ? "auront" : "aura"
                } accès aux données sur les financements de cette action`,
        };
    }

    return {
        title: () =>
            "Qui a accès aux données sur les financements de cette action ?",
        emptyList: () =>
            "Seuls les utilisateurs en préfecture, DDETS / DREETS et les services en charge de cette action ont accès aux données sur les financements.",
        fullList: (numberOfUsers) =>
            `${
                numberOfUsers > 1 ? "ont" : "a"
            } accès aux données sur les financements de cette action`,
    };
});

watch(actionId, reset);
watch(managers, reset);

function reset() {
    modale.value.reset();
}

function fetch() {
    if (actionId.value !== null && actionId.value !== undefined) {
        return getActionFinancementsReadersByAction(actionId.value);
    }

    return getActionsFinancesdReaders({
        departement: departement.value,
        managers: managers.value,
    });
}

defineExpose({
    open() {
        return modale.value.open();
    },
});
</script>
