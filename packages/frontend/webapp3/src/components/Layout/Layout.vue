<template>
    <NavBar />
    <main :class="!hero && !$slots.banner && padding ? 'pt-12' : ''">
        <div
            v-if="hero"
            class="h-44 bg-G300 text-white text-3xl sm:text-4xl lg:text-5xl bg-illustration"
            :class="!$slots.banner && padding ? 'mb-12' : ''"
        >
            <div
                class="bg-G800 bg-opacity-50 h-full font-bold flex items-center drop-shadow-lg"
            >
                <ContentWrapper class="drop-shadow-lg"
                    ><slot name="hero"
                        >Agir, pour résorber les bidonvilles</slot
                    ></ContentWrapper
                >
            </div>
        </div>
        <div
            v-if="$slots.banner"
            class="bg-G200"
            :class="padding ? 'mb-12' : ''"
        >
            <slot name="banner" />
        </div>

        <slot />
    </main>
    <FooterBar class="print:hidden" :class="padding ? 'mt-16' : ''" />
</template>

<style scoped>
.bg-illustration {
    background-image: url("@/assets/img/illustrations/bidonville.jpg");
    background-size: cover;
    background-position: 0% 70%;
}
</style>

<script setup>
import { defineProps, toRefs } from "vue";
import NavBar from "@/components/NavBar/NavBar.vue";
import FooterBar from "@/components/FooterBar/FooterBar.vue";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";

const props = defineProps({
    hero: {
        type: Boolean,
        required: false,
        default: false,
    },
    padding: {
        type: Boolean,
        required: false,
        default: true,
    },
});

const { hero, padding } = toRefs(props);
</script>
