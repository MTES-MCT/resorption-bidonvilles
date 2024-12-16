<template>
    <header class="shadow-md relative z-10 print:hidden">
        <ContentWrapper
            class="flex justify-between lg:py-3 items-start lg:items-center"
        >
            <IdentiteVisuelle class="-ml-3" />
            <NavBarTopMenu @show-mobile="showNavBarMobile" />
        </ContentWrapper>

        <NavBarMainMenu />
    </header>

    <NavBarMobile ref="navBarMobile" class="lg:hidden print:hidden" />
</template>

<script setup>
import { ref } from "vue";

// components
import { ContentWrapper, IdentiteVisuelle } from "@resorptionbidonvilles/ui";
import NavBarMainMenu from "./NavBarMainMenu.vue";
import NavBarMobile from "./NavBarMobile.vue";
import NavBarTopMenu from "./NavBarTopMenu.vue";

// data
const navBarMobile = ref(null);

// methods
function showNavBarMobile(event) {
    event.stopPropagation();
    navBarMobile.value.show();
}
</script>
