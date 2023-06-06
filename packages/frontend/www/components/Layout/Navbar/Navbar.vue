<template>
    <div ref="navbar">
        <div :class="!sticky && 'hidden'">
            <NavBarSticky :menuDisplayed="menuDisplayed" :toggleMenu="toggleMenu">
                <template v-slot:anchors>
                    <div class="mr-8 hidden 2xl:inline-block space-x-5">
                        <slot name="anchors"></slot>
                    </div>
                </template>
            </NavBarSticky>
        </div>

        <div :class="sticky && 'hidden'">
            <Container>
                <header role="navigation" class="py-4 flex flex-row justify-between items-center">
                    <NavBarLogo />

                    <div class="hidden md:flex flex-row items-center">
                        <div class="mr-8 hidden xl:block flex space-x-5">
                            <slot name="anchors"></slot>
                        </div>

                        <div>
                            <Link :to="`${WEBAPP_URL}/connexion`" class="ml-2">
                            <Button variant="primary">{{
                                $t("landingPage.header.connect")
                            }}</Button>
                            </Link>
                        </div>
                        <LanguagePicker v-model="language" :language="language" v-if="displayLanguagePicker" class="ml-2" />
                    </div>

                    <NavBarMobileButton class="md:hidden" :onClick="toggleMenu" />
                </header>
            </Container>
        </div>
        <NavBarMobileMenu class="fixed top-0 right-0 mt-16 z-10" v-if="menuDisplayed" @closeMenu="closeMenu"
            :displayLanguagePicker="displayLanguagePicker" />
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed, ref, onMounted, onUnmounted, watch } from "vue";
import { useI18n } from 'vue-i18n'
import NavBarLogo from "./NavBarLogo.vue";
import NavBarSticky from "./NavBarSticky.vue";
import NavBarMobileButton from "./NavBarMobileButton.vue";
import NavBarMobileMenu from "./NavBarMobileMenu.vue";
import Container from "~/components/Layout/Container/Container.vue";
import { Link, Button, LanguagePicker } from "@resorptionbidonvilles/ui";

const props = defineProps({
    stickyHeader: {
        type: Boolean
    },
    displayLanguagePicker: {
        type: Boolean,
        default: true
    }
});
const i18n = useI18n();
const { stickyHeader, displayLanguagePicker } = toRefs(props);

const { WEBAPP_URL } = useRuntimeConfig().public;
const scrollTop = ref(0)
const menuDisplayed = ref(false)
const navbar = ref(null);
const language = ref('fr')

watch(language, () => {
    i18n.locale.value = language.value
})

function handleScroll() {
    // Header is 76px but 0px when sticky
    const navbarHeight = navbar.value.offsetHeight;

    scrollTop.value = window.scrollY - navbarHeight;
}

function closeMenu() {
    menuDisplayed.value = false;
}

function toggleMenu() {
    menuDisplayed.value = !menuDisplayed.value;
}
const sticky = computed(() => {
    return scrollTop.value > 200 && stickyHeader.value;
});

onMounted(() => {
    window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>
