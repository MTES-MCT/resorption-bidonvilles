<template>
    <Modal
        closeWhenClickOutside
        @close="onClose"
        ref="modale"
        :resultsOverflow="false"
    >
        <template v-slot:title>{{ title }}</template>
        <template v-slot:subtitle>
            <form
                class="flex gap-2 flex-col sm:flex-row"
                @submit="modale.value.close()"
            >
                <InputLocation
                    class="flex-2 sm:flex-1 sm:w-96 col-span-2"
                    name="territorial_collectivity"
                    :placeholder="placeHolder"
                    withoutMargin
                    :allowFreeSearch="allowFreeSearch"
                    v-model="inputLocation"
                />
                <div class="flex flex-row">
                    <Button
                        size="sm"
                        type="button"
                        class="basis-sm"
                        @submit="handleSearchClick(inputLocation)"
                        >Rechercher</Button
                    >
                </div>
                <ErrorSummary class="mt-4" v-if="error" :message="error" />
            </form>
            <div class="mt-2 text-left text-sm">
                <p class="font-bold">Mes territoires :</p>
                <Link
                    v-for="(area, idx) in userStore.user.intervention_areas
                        .areas"
                    class="text-primary font-bold"
                    @click="setSearch(area)"
                    :key="idx"
                >
                    {{
                        area.type === "nation"
                            ? "France entière"
                            : area[area.type].name
                    }}</Link
                >
            </div>
        </template>
    </Modal>
</template>

<script setup>
import { toRefs, ref, computed, watch } from "vue";

import { trackEvent } from "@/helpers/matomo";
import backOrReplace from "@/utils/backOrReplace";
import { Button, ErrorSummary, Modal, Link } from "@resorptionbidonvilles/ui";
import InputLocation from "@/components/InputLocation/InputLocation.vue";

import { useUserStore } from "@/stores/user.store";
import { useTownsStore } from "@/stores/towns.store";
import { useActionsStore } from "@/stores/actions.store";

const props = defineProps({
    type: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: false,
        default: "",
    },
    title: String,
    placeHolder: {
        type: String,
        required: false,
        default: "",
    },
    showNationalWording: {
        type: String,
        required: false,
        default: "",
    },
    allowFreeSearch: {
        type: Boolean,
        required: false,
        default: true,
    },
});
const { type, to, title, allowFreeSearch } = toRefs(props);

const error = ref(null);
const modale = ref(null);

const userStore = useUserStore();
const townsStore = useTownsStore();
const actionStore = useActionsStore();

const activeStore = computed(() => {
    if (type.value === "sites") {
        return townsStore;
    } else {
        return actionStore;
    }
});

const location = computed({
    get() {
        return {
            search: null,
        };
    },
    set(newValue) {
        trackEvent(
            "Tableau de bord",
            "Recherche",
            `${type.value}: ${newValue.search}`
        );

        if (!newValue) {
            activeStore.value.filters.search = "";
            activeStore.value.filters.location = null;
        } else {
            activeStore.value.filters.search = newValue?.search;
            activeStore.value.filters.location = newValue?.data;
        }
    },
});

const inputLocation = computed({
    get() {
        return location.value;
    },
    set(newValue) {
        location.value = newValue;
        backOrReplace(to.value);
        modale.value.close();
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

const handleSearchClick = () => {
    backOrReplace("/liste-des-sites");
    modale.value.close();
};

watch(inputLocation, () => {
    modale.value.close();
});
</script>
