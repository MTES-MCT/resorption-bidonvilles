<template>
    <ModaleListeAcces
        titleClass="md:whitespace-nowrap md:mr-8"
        ref="modale"
        :wording="wording"
        :loadFn="fetch"
    />
</template>

<script setup>
import { ref, toRefs, watch, computed } from "vue";
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
                "Qui aura accès aux procédures judiciaires ou administratives ?",
            emptyList: () =>
                "Seuls les utilisateurs en préfecture et DDETS / DREETS auront accès aux données judiciaires ou administratives de ce site.",
            fullList: (numberOfUsers) =>
                `${
                    numberOfUsers > 1 ? "auront" : "aura"
                } accès aux données judiciaires de ce site`,
        };
    }

    return {
        title: () =>
            `Qui ${
                future.value ? "aura" : "a"
            } accès aux procédures judiciaires ou administratives ?`,
        emptyList: () =>
            "Seuls les utilisateurs en préfecture et DDETS / DREETS auront accès aux données judiciaires ou administratives de ce site.",
        fullList: (numberOfUsers) =>
            `${
                numberOfUsers > 1
                    ? future.value
                        ? "auront"
                        : "ont"
                    : future.value
                    ? "aura"
                    : "a"
            } accès aux données judiciaires ou administratives de ce site`,
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
</script>
