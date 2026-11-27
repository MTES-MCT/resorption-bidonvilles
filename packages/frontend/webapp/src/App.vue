<template>
    <BandeauEnvironnement />
    <NotificationGroup />
    <RouterView />
    <component
        v-if="modaleStore.component"
        :is="modaleStore.component"
        isOpen
        v-bind="modaleStore.props"
        @close="modaleStore.close"
    />
</template>

<script setup>
import BandeauEnvironnement from "@/components/BandeauEnvironnement/BandeauEnvironnement.vue";
import NotificationGroup from "@/components/NotificationGroup/NotificationGroup.vue";
import { RouterView } from "vue-router";
import { useModaleStore } from "@/stores/modale.store";

const modaleStore = useModaleStore();
</script>
