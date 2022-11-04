<template>
    <div class="fixed top-0 z-50 pt-4 w-64 md:w-96 left-1/2 -ml-32 md:-ml-48">
        <div class="flex flex-col space-y-4">
            <Notification
                v-for="item in notificationStore.items"
                :key="item.id"
                :variant="item.variant"
                @close="notificationStore.removeItem(item.id)"
            >
                <template v-slot:title>{{ item.title }}</template>
                <template v-slot:description>{{ item.description }}</template>
            </Notification>
        </div>
    </div>
</template>

<script setup>
import { useNotificationStore } from "@/stores/notification.store.js";
import Notification from "@/components/Notification/Notification.vue";

const notificationStore = useNotificationStore();
</script>
