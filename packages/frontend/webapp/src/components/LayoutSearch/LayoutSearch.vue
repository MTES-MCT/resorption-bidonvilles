<template>
    <Layout v-bind="$attrs">
        <template v-slot:banner>
            <div
                class="pt-6 text-center print:hidden"
                :class="showReset ? 'pb-4' : 'pb-10'"
            >
                <h1 class="text-lg xl:text-xl font-bold">{{ searchTitle }}</h1>
                <ContentWrapper class="mt-3" size="medium">
                    <div class="flex items-center space-x-2">
                        <InputLocation
                            class="flex-1"
                            name="territorial_collectivity"
                            :placeholder="searchPlaceholder"
                            withoutMargin
                            :allowFreeSearch="allowFreeSearch"
                            v-model="inputLocation"
                        />
                        <Button size="sm" type="button">Rechercher</Button>
                    </div>
                    <p
                        class="mt-1 text-right text-sm font-bold"
                        v-if="showReset"
                    >
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
        </template>
        <slot />
    </Layout>
</template>

<script setup>
import { defineProps, toRefs, computed, defineEmits } from "vue";
import { useUserStore } from "@/stores/user.store";

import Layout from "@/components/Layout/Layout.vue";
import {} from "@resorptionbidonvilles/ui";
import InputLocation from "@/components/InputLocation/InputLocation.vue";
import { Button, ContentWrapper, Icon, Link } from "@resorptionbidonvilles/ui";

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
});

const {
    searchTitle,
    allowFreeSearch,
    searchPlaceholder,
    showNationalWording,
    location,
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
const showReset = computed(() => {
    if (isNotOnDefaultFilter.value) {
        return true;
    }

    return (
        showNationalWording.value &&
        userStore.user.organization.location.type !== "nation"
    );
});

const isNotOnDefaultFilter = computed(() => {
    return !userStore.isMyLocation(inputLocation.value);
});

function resetSearch() {
    inputLocation.value = userStore.defaultLocationFilter;
}

function emptySearch() {
    inputLocation.value = {
        search: "",
        data: null,
    };
}
</script>
