<template>
    <div class="sm:m-auto sm:w-1/2 w-full pb-10 text-center print:hidden">
        <h2 class="text-lg xl:text-xl font-bold text-primary">
            Rechercher un contact, un acteur, une structure...
        </h2>
        <ContentWrapper class="mt-3" size="medium">
            <div
                class="flex flex-col sm:flex-row w-full items-center sm:space-x-2"
            >
                <InputCommunauteSearch
                    class="flex-1 w-full"
                    placeholder="Nom d'un territoire, d'une structure, d'un acteur..."
                    withoutMargin
                    :allowFreeSearch="true"
                    name="search"
                    @update:modelValue="handleEmit"
                />
                <DsfrButton size="md">Rechercher</DsfrButton>
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
import { useForm } from "vee-validate";
import { useUserStore } from "@/stores/user.store";
import { useDirectoryStore } from "@/stores/directory.store";

import InputCommunauteSearch from "../InputCommunauteSearch/InputCommunauteSearch.vue";
import { ContentWrapper, Icon, Link } from "@resorptionbidonvilles/ui";
import { toRef } from "vue";
import { watch } from "vue";

const directoryStore = useDirectoryStore();
const userStore = useUserStore();
const { location, search } = toRefs(directoryStore.filters);
const showNationalWording = "Voir tous les acteurs de France";

const emit = defineEmits(["update:search"]);
const { values, setFieldValue } = useForm({
    initialValues: {
        search: {
            search: search.value,
            data: location.value,
        },
    },
});

const searchValue = toRef(values, "search");
watch(searchValue, (value) => {
    emit("update:search", value);
});

const showReset = computed(() => {
    if (isNotOnDefaultFilter.value) {
        return true;
    }

    return !userStore.user.intervention_areas.is_national;
});

const isNotOnDefaultFilter = computed(() => {
    return !userStore.isMyLocation(values.search);
});

const handleEmit = (value) => setFieldValue("search", value);

function resetSearch() {
    setFieldValue("search", userStore.defaultLocationFilter);
}

function emptySearch() {
    setFieldValue("search", {
        search: "",
        data: null,
    });
}
</script>
