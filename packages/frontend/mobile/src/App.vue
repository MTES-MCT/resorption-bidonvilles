<template>
    <div class="h-full">
        <RouterView />
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import router from "./js/router";

onMounted(() => {
    window.addEventListener("callRouter", ({ detail }) => {
        router[detail.routerMethod](...(detail.routerArgs || []));
    });
});
</script>
