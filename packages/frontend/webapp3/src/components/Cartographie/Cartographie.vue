<template>
    <div class="flex">
        <div class="bg-G200 w-64">a</div>
        <div class="flex-1" style="height: 100vh" ref="cartographie">
            <Carte />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Carte from "@/components/Carte/Carte.vue";

const cartographie = ref(null);
onMounted(() => {
    document.body.scrollTop = cartographie.value.offsetTop;
});
</script>
