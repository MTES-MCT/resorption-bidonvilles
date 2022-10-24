<template>
    <Pagination
        :currentPage="directoryStore.currentPage.index"
        :nbPages="directoryStore.numberOfPages"
        @pagechange="changePage"
    />
</template>

<script setup>
import { useDirectoryStore } from "@/stores/directory.store";
import { Pagination } from "@resorptionbidonvilles/ui";
const directoryStore = useDirectoryStore();

function changePage(page) {
    directoryStore.currentPage.index = page;
}
</script>
