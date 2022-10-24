<template>
    <section class="flex flex-col space-y-4">
        <CarteSiteDetaillee v-for="shantytown in (printMode
        ? townsStore.filteredTowns
        : townsStore.currentPage.content)" :key="shantytown.id" :shantytown="shantytown" />
    </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useTownsStore } from '@/stores/towns.store';
import CarteSiteDetaillee from "@/components/CarteSiteDetaillee/CarteSiteDetaillee.vue";

const townsStore = useTownsStore();
const printMode = ref(false);
onMounted(() => {
    window.onbeforeprint = () => {
        printMode.value = true;
    };
    window.onafterprint = () => {
        printMode.value = false;
    };
});
</script>