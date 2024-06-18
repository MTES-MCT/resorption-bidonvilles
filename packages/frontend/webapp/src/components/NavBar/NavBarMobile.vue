<template>
    <div
        v-show="!isMobileMenuHidden"
        class="mobileMenu-transition fixed top-0 left-0 h-full w-full bg-white opacity-0 -z-10"
        ref="mobileMenu"
    >
        <header @click="hideMobileMenu" class="mt-3 text-right">
            <Button variant="primaryText" size="md" icon="times">Fermer</Button>
        </header>

        <nav class="px-3">
            <LinkBlock
                v-for="item in navigationStore.topItems"
                :key="item.label"
                :to="item.route"
                :icon="item.icon"
                >{{ item.label }}</LinkBlock
            >
        </nav>
        <nav class="mt-3 border-t pt-3 px-3">
            <LinkBlock
                v-for="item in navigationStore.mainItems"
                :key="item.label"
                :to="item.route"
                :active="item.active === true"
                variant="black"
                class="font-bold"
                >{{ item.label }}</LinkBlock
            >
        </nav>
    </div>
</template>

<style scoped>
.mobileMenu-transition {
    transition: opacity 0.3s 0s ease-in-out;
}

.devise {
    font-size: 0.78rem;
    line-height: 0.8rem;
}
</style>

<script setup>
import { ref, onMounted, defineExpose } from "vue";
import { useNavigationStore } from "@/stores/navigation.store.js";

// components
import { Button, LinkBlock } from "@resorptionbidonvilles/ui";

// data
const mobileMenu = ref(null);
const navigationStore = useNavigationStore();
let isMobileMenuHidden = ref(false);

// mounted
onMounted(() => {
    mobileMenu.value.addEventListener(
        "transitionend",
        onMobileMenuTransitionEnd
    );
    isMobileMenuHidden.value = true;
});

// methods
function showMobileMenu() {
    isMobileMenuHidden.value = false;
    document.body.style.overflow = "hidden";
    mobileMenu.value.style.zIndex = "11";
    mobileMenu.value.style.opacity = "1";
}

function hideMobileMenu() {
    mobileMenu.value.style.opacity = "0";
    isMobileMenuHidden.value = true;
}

function onMobileMenuTransitionEnd() {
    // if hidden, restore document.body scroll
    if (mobileMenu.value.style.opacity === "0") {
        mobileMenu.value.style.zIndex = "-10";
        document.body.style.overflow = "auto";
    }
}

// exposure
defineExpose({
    show: showMobileMenu,
});
</script>
