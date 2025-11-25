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
            class="relative"
            >{{ item.label === "Mon profil" ? username : item.label }}
            <DsfrTooltip
                v-if="
                    item.label === 'Blog' &&
                    configStore.config?.blog?.isBadgeActive
                "
                class="absolute -top-2 left-0 ml-1 text-[#fe1744] text-3xl z-2"
                content="Nouvel article"
                on-hover
                @click.stop.prevent="openTooltipLink(item.route)"
            >
                <div class="relative items-center leading-3 cursor-pointer">
                    <p class="absolute top-1">●</p>
                    <p
                        class="absolute top-1.5 ml-[.7px] left-1.5 items-center justify-center text-white text-[9px]"
                    >
                        1
                    </p>
                </div>
            </DsfrTooltip>
        </LinkButton>
    </nav>
</template>

<script setup>
import { computed } from "vue";
import { useNavigationStore } from "@/stores/navigation.store.js";
import { useUserStore } from "@/stores/user.store";
import { useConfigStore } from "@/stores/config.store";
import { Button, LinkButton } from "@resorptionbidonvilles/ui";
import router from "@/helpers/router.js";

const navigationStore = useNavigationStore();
const userStore = useUserStore();
const configStore = useConfigStore();

const username = computed(() => {
    return `${userStore.user.first_name
        .slice(0, 1)
        .toUpperCase()}${userStore.user.first_name
        .slice(1)
        .toLowerCase()} ${userStore.user.last_name.slice(0, 1)}.`;
});
defineEmits(["showMobile"]);

const openTooltipLink = (route) => {
    if (typeof window === "undefined") {
        return;
    }

    const resolved =
        typeof route === "string"
            ? router.resolve({ path: route })
            : router.resolve(route);
    window.open(resolved.href, "_blank", "noopener");
};
</script>
