<template>
    <div>
        <section class="flex flex-col space-y-4">
            <CarteSiteDetaillee
                v-for="shantytown in printMode
                    ? townsStore.filteredTowns
                    : townsStore.currentPage.content"
                :key="shantytown.id"
                :shantytown="shantytown"
                :currentTab="currentTab"
            />
        </section>
        <BottomPagination
            :from="townsStore.currentPage.from"
            :to="townsStore.currentPage.to"
            :total="townsStore.filteredTowns.length"
            :currentPage="townsStore.currentPage.index"
            :numberOfPages="townsStore.numberOfPages"
            @pagechange="changePage"
        />
    </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from "vue";
import { useTownsStore } from "@/stores/towns.store";
import { BottomPagination } from "@resorptionbidonvilles/ui";
import CarteSiteDetaillee from "@/components/CarteSiteDetaillee/CarteSiteDetaillee.vue";

// eslint-disable-next-line no-unused-vars
const props = defineProps({
    currentTab: {
        type: String,
    },
});

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

function changePage(page) {
    townsStore.currentPage.index = page;
}
</script>
