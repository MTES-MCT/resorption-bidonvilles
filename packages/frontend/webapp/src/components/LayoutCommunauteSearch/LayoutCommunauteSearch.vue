<template>
    <Layout v-bind="$attrs">
        <template v-slot:banner>
            <div class="pt-6 pb-10 text-center print:hidden">
                <h1 class="text-lg xl:text-xl font-bold">{{ searchTitle }}</h1>
                <ContentWrapper class="mt-3" size="medium">
                    <div class="flex items-center space-x-2">
                        <InputCommunauteSearch
                            class="flex-1"
                            :placeholder="searchPlaceholder"
                            withoutMargin
                            :allowFreeSearch="allowFreeSearch"
                            v-model="inputSearch"
                        />
                        <Button size="sm" type="button">Rechercher</Button>
                    </div>
                </ContentWrapper>
            </div>
        </template>
        <slot />
    </Layout>
</template>

<script setup>
import { defineProps, toRefs, computed, defineEmits } from "vue";

import Layout from "@/components/Layout/Layout.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import InputCommunauteSearch from "../InputCommunauteSearch/InputCommunauteSearch.vue";
import { Button } from "@resorptionbidonvilles/ui";

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
    search: {
        type: Object,
        required: false,
        default: () => undefined,
    },
});

const { searchTitle, allowFreeSearch, searchPlaceholder, search } =
    toRefs(props);
const emit = defineEmits(["update:search"]);

const inputSearch = computed({
    get() {
        return search.value;
    },
    set(newValue) {
        emit("update:search", newValue);
    },
});
</script>
