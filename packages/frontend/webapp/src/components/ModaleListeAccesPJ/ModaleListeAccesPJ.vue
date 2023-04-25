<template>
    <ModaleListeAcces ref="modale" :wording="wording" :loadFn="fetch" />
</template>

<script setup>
import { defineExpose, ref, toRefs, watch, computed } from "vue";
import ModaleListeAcces from "@/components/ModaleListeAcces/ModaleListeAcces.vue";
import { getJusticeReaders as getJusticeReadersByShantytown } from "@/api/towns.api";
import { get as getJusticeReadersByLocation } from "@/api/justice_readers.api";

const props = defineProps({
    townId: Number,
    location: Object,
    future: Boolean,
});
const { townId, location, future } = toRefs(props);
const modale = ref(null);

const wording = computed(() => {
    if (future.value === true) {
        return {
            title: () =>
                "Qui aura accès aux données sur la procédure judiciaire ?",
            emptyList: () =>
                "Seuls les utilisateurs en préfecture et DEETS / DREETS auront accès aux données judiciaires de ce site.",
            fullList: (numberOfUsers) =>
                `${
                    numberOfUsers > 1 ? "auront" : "aura"
                } accès aux données judiciaires de ce site`,
        };
    }

    return {
        title: () => "Qui a accès aux données sur la procédure judiciaire ?",
        emptyList: () =>
            "Seuls les utilisateurs en préfecture et DEETS / DREETS a accès aux données judiciaires de ce site.",
        fullList: (numberOfUsers) =>
            `${
                numberOfUsers > 1 ? "ont" : "a"
            } accès aux données judiciaires de ce site`,
    };
});

function fetch() {
    if (townId.value !== null && townId.value !== undefined) {
        return getJusticeReadersByShantytown(townId.value);
    }

    if (!location.value) {
        throw new Error("Localisation ou site est obligatoire");
    }

    return getJusticeReadersByLocation(
        location.value.type,
        location.value[location.value.type].code
    );
}

watch(townId, reset);
watch(location, reset);

function reset() {
    modale.value.reset();
}

defineExpose({
    open() {
        return modale.value.open();
    },
});
</script>
