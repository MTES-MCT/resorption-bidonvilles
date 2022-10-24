<template>
    <!-- mobile -->
    <h1
        class="font-bold text-sm py-2 px-4 border-t sm:text-md md:text-lg lg:hidden"
    >
        Résorption-bidonvilles
    </h1>

    <!-- desktop -->
    <div class="border-t">
        <ContentWrapper
            class="hidden lg:block"
            v-if="navigationStore.mainItems.length > 0"
        >
            <nav class="flex text-sm -ml-6">
                <NavBarMainMenuItem
                    v-for="item in navigationStore.mainItems"
                    :key="item.label"
                    :to="item.route"
                    :active="item.active"
                    >{{ item.label }}</NavBarMainMenuItem
                >
            </nav>
        </ContentWrapper>
    </div>
</template>

<script setup>
import { useNavigationStore } from "@/stores/navigation.store.js";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import NavBarMainMenuItem from "./NavBarMainMenuItem.vue";

const navigationStore = useNavigationStore();
</script>
