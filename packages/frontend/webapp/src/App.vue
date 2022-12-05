<template>
    <NotificationGroup />
    <RouterView />
</template>

<script setup>
import NotificationGroup from "@/components/NotificationGroup/NotificationGroup.vue";
import { RouterView } from "vue-router";
</script>
