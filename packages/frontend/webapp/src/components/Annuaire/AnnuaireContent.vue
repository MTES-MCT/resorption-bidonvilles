<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CarteStructure
            v-for="organization in directoryStore.currentPage.content"
            :key="organization.id"
            :organization="organization"
        />
    </div>

    <AnnuairePagination class="mt-4 justify-end" autoScrollFix />
</template>

<script setup>
import { useDirectoryStore } from "@/stores/directory.store";
import CarteStructure from "@/components/CarteStructure/CarteStructure.vue";
import AnnuairePagination from "./AnnuairePagination.vue";

const directoryStore = useDirectoryStore();
</script>
