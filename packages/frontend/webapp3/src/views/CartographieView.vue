<template>
    <Layout :paddingTop="false" :paddingBottom="false">
        <Cartographie />
    </Layout>
</template>

<script setup>
import { onMounted } from "vue";
import { useTownsStore } from "@/stores/towns.store";

import Layout from "@/components/Layout/Layout.vue";
import Cartographie from "@/components/Cartographie/Cartographie.vue";

const townsStore = useTownsStore();

onMounted(() => {
    if (townsStore.towns.length === 0) {
        load();
    }
});

function load() {
    townsStore.fetchTowns();
}
</script>
