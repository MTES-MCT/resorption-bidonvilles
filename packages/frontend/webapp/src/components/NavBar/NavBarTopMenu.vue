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
            >{{
                item.label === "Mon profil" ? username : item.label
            }}</LinkButton
        >
    </nav>
</template>

<script setup>
import { computed, defineEmits } from "vue";
import { useNavigationStore } from "@/stores/navigation.store.js";
import { useUserStore } from "@/stores/user.store";
import { Button, LinkButton } from "@resorptionbidonvilles/ui";

const navigationStore = useNavigationStore();
const userStore = useUserStore();

const username = computed(() => {
    return `${userStore.user.first_name
        .slice(0, 1)
        .toUpperCase()}${userStore.user.first_name
        .slice(1)
        .toLowerCase()} ${userStore.user.last_name.slice(0, 1)}.`;
});
defineEmits(["showMobile"]);
</script>
