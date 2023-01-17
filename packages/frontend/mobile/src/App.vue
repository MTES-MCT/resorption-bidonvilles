<template>
    <div class="h-full">
        <NotificationGroup />
        <RouterView />
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import NotificationGroup from "#src/js/components/Notification/NotificationGroup.vue";
import { RouterView } from "vue-router";
import router from "./js/router";

onMounted(() => {
    window.addEventListener("callRouter", ({ detail }) => {
        router[detail.routerMethod](...(detail.routerArgs || []));
    });
});
</script>
