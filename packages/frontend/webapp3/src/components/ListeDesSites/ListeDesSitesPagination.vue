<template>
    <Pagination
        :currentPage="townsStore.currentPage.index"
        :nbPages="townsStore.numberOfPages"
        @pagechange="changePage"
    />
</template>

<script setup>
import { useTownsStore } from "@/stores/towns.store";
import { Pagination } from "@resorptionbidonvilles/ui";
const townsStore = useTownsStore();

function changePage(page) {
    townsStore.currentPage.index = page;
}
</script>
