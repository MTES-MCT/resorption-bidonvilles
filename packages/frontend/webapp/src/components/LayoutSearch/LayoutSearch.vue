<template>
    <Layout v-bind="$attrs">
        <template v-slot:banner>
            <div class="pt-6 text-center print:hidden pb-10">
                <p class="text-lg xl:text-xl font-bold">{{ searchTitle }}</p>
                <span class="sr-only"
                    >Saisissez une valeur dans le champ qui suit pour rechercher
                    un site, une commune, un département, puis sélectionner
                    l'item de votre choix dans la liste en vous déplaçant à
                    l'aide des flèches directionnelles</span
                >
                <ContentWrapper class="mt-3" size="medium">
                    <div role="search" class="flex items-center space-x-2">
                        <InputLocation
                            class="flex-1"
                            name="territorial_collectivity"
                            :placeholder="searchPlaceholder"
                            withoutMargin
                            :allowFreeSearch="allowFreeSearch"
                            v-model="inputLocation"
                        />
                        <Button size="sm" type="button" class="py-1.5"
                            >Rechercher</Button
                        >
                    </div>
                    <div class="mt-2 text-left text-sm">
                        <p class="font-bold">Mes territoires :</p>
                        <Link
                            v-for="(area, idx) in searchAreas"
                            :class="
                                ((inputLocation.data === null &&
                                    area.type === 'nation') ||
                                    inputLocation.data?.typeUid ===
                                        area.type) &&
                                inputLocation.data?.code ===
                                    area[area.type]?.code
                                    ? 'text-primary font-bold '
                                    : ''
                            "
                            @click="setSearch(area)"
                            :key="idx"
                            >{{
                                area.type === "nation"
                                    ? "France entière"
                                    : area[area.type].name
                            }}</Link
                        >
                    </div>
                </ContentWrapper>
            </div>
        </template>
        <slot />
    </Layout>
</template>

<script setup>
import { defineProps, toRefs, computed, defineEmits } from "vue";
import { useUserStore } from "@/stores/user.store";

import Layout from "@/components/Layout/Layout.vue";
import InputLocation from "@/components/InputLocation/InputLocation.vue";
import { Button, ContentWrapper, Link } from "@resorptionbidonvilles/ui";

const props = defineProps({
    searchTitle: {
        type: String,
        required: true,
    },
    searchPlaceholder: {
        type: String,
        required: false,
    },
    allowFreeSearch: {
        type: Boolean,
        required: false,
        default: true,
    },
    showNationalWording: {
        type: String,
        required: false,
        default: "",
    },
    location: {
        type: Object,
        required: false,
        default: () => undefined,
    },
    displayMetropole: {
        type: Boolean,
        required: false,
        default: true,
    },
});

const {
    searchTitle,
    allowFreeSearch,
    searchPlaceholder,
    location,
    displayMetropole,
} = toRefs(props);
const emit = defineEmits(["update:location"]);
const userStore = useUserStore();

const inputLocation = computed({
    get() {
        return location.value;
    },
    set(newValue) {
        emit("update:location", newValue);
    },
});

function setSearch(area) {
    if (area.type === "nation") {
        return emptySearch();
    }

    inputLocation.value = {
        search: area[area.type].name,
        data: {
            code: area[area.type].code,
            departement: area.departement?.code || null,
            typeUid: area.type,
            typeName: "-",
        },
    };
}

function emptySearch() {
    inputLocation.value = {
        search: "",
        data: null,
    };
}

const searchAreas = computed(() => {
    if (displayMetropole.value === false) {
        const filtered = userStore.user.intervention_areas.areas.filter(
            (area) => area.type !== "metropole"
        );
        return filtered;
    } else {
        return userStore.user.intervention_areas.areas;
    }
});
</script>
