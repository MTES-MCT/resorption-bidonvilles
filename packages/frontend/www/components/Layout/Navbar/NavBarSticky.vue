<template>
    <div class="fixed z-10 top-0 left-0 w-full bg-white shadow">
        <Container>
            <header role="navigation" class="py-4 flex flex-row justify-between items-center">
                <NavBarLogo />
                <!-- Desktop actions -->
                <div class="hidden md:block">
                    <slot name="anchors"></slot>

                    <LinkContact v-if="i18n.locale.value === 'fr'" class="mr-2 inline-block" isDemandeAcces>
                        <Button variant="primary" tabindex="-1">{{
                            $t("landingPage.contactForm.ctaSignup")
                        }}</Button>
                    </LinkContact>
                    <LinkContact v-else class="mr-2 inline-block">
                        <Button variant="primary" tabindex="-1">{{
                            $t("landingPage.contactForm.ctaContact")
                        }}</Button>
                    </LinkContact>

                    <Link :to="`${WEBAPP_URL}/connexion`" class="inline-block">
                    <Button variant="secondary"  tabindex="-1">{{
                        $t("landingPage.header.connect")
                    }}</Button>
                    </Link>
                </div>

                <NavBarMobileButton class="md:hidden" :onClick="toggleMenu" />
            </header>
        </Container>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import NavBarLogo from "./NavBarLogo.vue";
import NavBarMobileButton from "./NavBarMobileButton.vue";
import Container from "~/components/Layout/Container/Container.vue";
import { useI18n } from 'vue-i18n';
import LinkContact from "~/components/LinkContact/LinkContact.vue";
import { Button, Link } from "@resorptionbidonvilles/ui";

const { WEBAPP_URL } = useRuntimeConfig().public;

const i18n = useI18n();
const props = defineProps({
    toggleMenu: {
        type: Function,
        required: true
    }
});
const { toggleMenu } = toRefs(props);
</script>
