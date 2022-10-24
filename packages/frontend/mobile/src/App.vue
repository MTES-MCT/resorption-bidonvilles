<template>
    <div class="h-full">
        <NotificationGroup />
        <RouterView />
    </div>
</template>

<script setup>
import NotificationGroup from "#src/js/components/Notification/NotificationGroup.vue";
import { RouterView } from "vue-router";
</script>
