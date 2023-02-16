<template>
    <LayoutCommunaute>
        <Annuaire />
    </LayoutCommunaute>
</template>

<script setup>
import { onMounted } from "vue";
import { useDirectoryStore } from "@/stores/directory.store";

import LayoutCommunaute from "@/components/LayoutCommunaute/LayoutCommunaute.vue";
import Annuaire from "@/components/Annuaire/Annuaire.vue";

const directoryStore = useDirectoryStore();

onMounted(() => {
    if (!directoryStore.isLoaded) {
        load();
    }
});

function load() {
    directoryStore.fetchDirectory();
}
</script>
