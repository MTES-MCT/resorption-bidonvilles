<template>
    <SkipToMainContentLink />
    <NavBar />
    <main
        id="contenu-principal"
        :class="!hero && !$slots.banner && paddingTop ? 'pt-8' : ''"
    >
        <div
            v-if="hero"
            class="h-44 bg-G300 text-white text-3xl sm:text-4xl lg:text-5xl bg-illustration"
            :class="!$slots.banner && paddingTop ? 'mb-8' : ''"
        >
            <div
                class="bg-G800 bg-opacity-85 h-full font-bold flex items-center drop-shadow-lg"
            >
                <ContentWrapper class="drop-shadow-lg">
                    <slot name="hero">Agir, pour résorber les bidonvilles</slot>
                </ContentWrapper>
            </div>
        </div>
        <div
            v-if="$slots.banner"
            class="relative bg-G200"
            :class="paddingTop ? 'mb-8' : ''"
        >
            <slot name="banner" />
        </div>

        <slot />
    </main>
    <FooterBar
        id="pied-de-page"
        class="print:hidden"
        :class="paddingBottom ? 'mt-16' : ''"
        :CONTACT_EMAIL="CONTACT_EMAIL"
        :showSiteMapLink="userStore.isLoggedIn"
    />
</template>

<style scoped>
.bg-illustration {
    background-image: url("@/assets/img/illustrations/bidonville.jpg");
    background-size: cover;
    background-position: 0% 70%;
}
</style>

<script setup>
import ENV from "@/helpers/env.js";
import { defineProps, toRefs } from "vue";
import { useUserStore } from "@/stores/user.store.js";

import NavBar from "@/components/NavBar/NavBar.vue";
import {
    ContentWrapper,
    FooterBar,
    SkipToMainContentLink,
} from "@resorptionbidonvilles/ui";

const { CONTACT_EMAIL } = ENV;
const userStore = useUserStore();

const props = defineProps({
    hero: {
        type: Boolean,
        required: false,
        default: false,
    },
    paddingTop: {
        type: Boolean,
        required: false,
        default: true,
    },
    paddingBottom: {
        type: Boolean,
        required: false,
        default: true,
    },
});

const { hero, paddingTop, paddingBottom } = toRefs(props);
</script>
