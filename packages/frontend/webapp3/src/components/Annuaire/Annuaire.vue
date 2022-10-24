<template>
    <ContentWrapper>
        <ViewHeader icon="user">
            <template v-slot:title
                >Découvrez notre communauté —
                <span class="text-info">{{ title }}</span></template
            >
            <template v-slot:description>
                Retrouvez ici les coordonnées des structures et personnes
                inscrites sur la plateforme
            </template>
        </ViewHeader>

        <AnnuaireHeader :location="location" :search="search" />
        <AnnuaireFiltres class="mt-6 mb-4" />

        <AnnuaireContent v-if="directoryStore.total > 0" />
        <div v-else class="border-t pt-12">
            <AnnuaireVide />
        </div>
    </ContentWrapper>
</template>

<script setup>
import { computed, toRefs } from "vue";
import computeLocationSearchTitle from "@/utils/computeLocationSearchTitle";
import { useDirectoryStore } from "@/stores/directory.store";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import AnnuaireHeader from "./AnnuaireHeader.vue";
import AnnuaireFiltres from "./AnnuaireFiltres.vue";
import AnnuaireContent from "./AnnuaireContent.vue";
import AnnuaireVide from "./AnnuaireVide.vue";

const directoryStore = useDirectoryStore();
const { location, search } = toRefs(directoryStore.filters);

const title = computed(() => {
    return computeLocationSearchTitle(search.value, location.value);
});
</script>
