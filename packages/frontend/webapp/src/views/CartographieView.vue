<template>
    <LayoutLoading v-if="townsStore.isLoading !== false" />

    <LayoutError v-else-if="townsStore.error !== null">
        <template v-slot:title>Cartographie inaccessible</template>
        <template v-slot:code>{{ townsStore.error }}</template>
        <template v-slot:content
            >Vous souhaitiez accéder à la cartographie des bidonvilles et squat
            en France mais nous ne parvenons pas à collecter les données
            nécessaires. Vous pouvez réessayer un peu plus tard ou nous
            contacter si le problème persiste.</template
        >
        <template v-slot:actions>
            <Button
                icon="rotate-right"
                iconPosition="left"
                type="button"
                @click="load"
                >Réessayer</Button
            >
            <ButtonContact />
        </template>
    </LayoutError>

    <Layout v-else :paddingTop="false" :paddingBottom="false">
        <Cartographie />
    </Layout>
</template>

<script setup>
import { onMounted } from "vue";
import { useTownsStore } from "@/stores/towns.store";
import { usePoiStore } from "@/stores/poi.store";

import { Button } from "@resorptionbidonvilles/ui";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import Layout from "@/components/Layout/Layout.vue";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import Cartographie from "@/components/Cartographie/Cartographie.vue";

const townsStore = useTownsStore();
const poiStore = usePoiStore();

onMounted(async () => {
    if (townsStore.towns.length === 0) {
        load();
    }

    if (poiStore.pois.length === 0) {
        try {
            await poiStore.fetch();
        } catch (e) {
            console.log("Failed fetching POIs from soliguide.fr");
        }
    }
});

function load() {
    townsStore.fetchTowns();
}
</script>
