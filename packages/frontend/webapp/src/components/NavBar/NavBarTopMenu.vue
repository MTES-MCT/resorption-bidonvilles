<template>
    <!-- mobile -->
    <Button
        icon="bars"
        variant="text"
        size="lg"
        class="mt-1 lg:hidden"
        :padding="false"
        type="button"
        @click="$emit('showMobile', $event)"
        ><span class="sr-only">Afficher le menu</span></Button
    >

    <!-- desktop -->
    <nav class="hidden lg:flex space-x-2 text-sm -mr-3">
        <LinkButton
            v-for="item in navigationStore.topItems"
            :key="item.label"
            :to="item.route"
            :icon="item.icon"
            >{{ item.label }}</LinkButton
        >
    </nav>
</template>

<script setup>
import { defineEmits } from "vue";
import { useNavigationStore } from "@/stores/navigation.store.js";
import { Button, LinkButton } from "@resorptionbidonvilles/ui";

const navigationStore = useNavigationStore();
defineEmits(["showMobile"]);
</script>
