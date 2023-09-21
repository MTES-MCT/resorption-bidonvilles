<template>
    <div class="m-auto w-1/2 pb-10 text-center print:hidden">
        <h2 class="text-lg xl:text-xl font-bold text-primary">
            Rechercher un contact, un acteur, une structure...
        </h2>
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
                    <Icon icon="rotate-left" /> Revenir à mon territoire</Link
                >
                <Link v-else @click="emptySearch">
                    {{ showNationalWording }}</Link
                >
            </p>
        </ContentWrapper>
    </div>
</template>

<script setup>
import { toRefs, computed, defineEmits } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useDirectoryStore } from "@/stores/directory.store";

import InputCommunauteSearch from "../InputCommunauteSearch/InputCommunauteSearch.vue";
import { Button, ContentWrapper, Icon, Link } from "@resorptionbidonvilles/ui";

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
        emit("update:search", newValue);
    },
});

const showReset = computed(() => {
    if (isNotOnDefaultFilter.value) {
        return true;
    }

    return userStore.user.organization.location.type !== "nation";
});

const isNotOnDefaultFilter = computed(() => {
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
