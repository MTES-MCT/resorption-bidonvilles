<template>
    <ContentWrapper>
        <div class="m-auto w-1/2 pt-6 pb-10 text-center print:hidden">
            <h1 class="text-lg xl:text-xl font-bold">
                Rechercher un contact, un acteur, une structure...
            </h1>
            <ContentWrapper class="mt-3" size="medium">
                <div class="flex items-center space-x-2">
                    <InputCommunauteSearch
                        class="flex-1"
                        placeholder="Nom d'un territoire, d'une structure, d'un acteur..."
                        withoutMargin
                        :allowFreeSearch="true"
                        v-model="inputSearch"
                    />
                    <Button size="sm" type="button">Rechercher</Button>
                </div>
                <p class="mt-1 text-right text-sm font-bold" v-if="showReset">
                    <Link v-if="isNotOnDefaultFilter" @click="resetSearch">
                        <Icon icon="rotate-left" /> Revenir à mon
                        territoire</Link
                    >
                    <Link v-else @click="emptySearch">
                        {{ showNationalWording }}</Link
                    >
                </p>
            </ContentWrapper>
        </div>
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
import { Button, Link, Icon } from "@resorptionbidonvilles/ui";
import { computed, toRefs, defineEmits } from "vue";
import computeLocationSearchTitle from "@/utils/computeLocationSearchTitle";
import { useDirectoryStore } from "@/stores/directory.store";
import { useUserStore } from "@/stores/user.store";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import AnnuaireHeader from "./AnnuaireHeader.vue";
import AnnuaireFiltres from "./AnnuaireFiltres.vue";
import AnnuaireContent from "./AnnuaireContent.vue";
import AnnuaireVide from "./AnnuaireVide.vue";
import InputCommunauteSearch from "../InputCommunauteSearch/InputCommunauteSearch.vue";

const directoryStore = useDirectoryStore();
const userStore = useUserStore();
const { location, search } = toRefs(directoryStore.filters);
const showNationalWording = "Voir tous les acteurs de France";

const emit = defineEmits(["update:search"]);

const inputSearch = computed({
    get() {
        return {
            search: search.value,
            data: location.value,
        };
    },
    set(newValue) {
        console.log();
        emit("update:search", newValue);
    },
});
const title = computed(() => {
    return computeLocationSearchTitle(search.value, location.value);
});

const showReset = computed(() => {
    if (isNotOnDefaultFilter.value) {
        return true;
    }

    return userStore.user.organization.location.type !== "nation";
});

const isNotOnDefaultFilter = computed(() => {
    console.log("filtre a changé");
    return !userStore.isMyLocation(inputSearch.value);
});

function resetSearch() {
    inputSearch.value = userStore.defaultLocationFilter;
}

function emptySearch() {
    inputSearch.value = {
        search: "",
        data: null,
    };
}
</script>
