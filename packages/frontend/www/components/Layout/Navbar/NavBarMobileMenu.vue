<template>
    <div ref="navbarMobile" class="origin-top-right right-0 mt-2 w-48 rounded-md shadow-lg">
        <Menu>
            <MenuItem>
            <Link :to="`${WEBAPP_URL}/connexion`">{{
                $t("landingPage.header.connect")
            }}</Link>
            </MenuItem>

            <MenuItem>
            <LinkContact withStyle v-if="i18n.locale.value === 'fr'">{{
                $t("landingPage.contactForm.ctaSignup")
            }}</LinkContact>
            <LinkContact withStyle v-else>{{
                $t("landingPage.header.contact")
            }}</LinkContact>
            </MenuItem>

            <MenuItem>
            <LanguagePicker :language="language" v-model="language" />
            </MenuItem>
        </Menu>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, defineEmits } from "vue";
import { useI18n } from 'vue-i18n';

import { Link, Menu, LanguagePicker, MenuItem } from "@resorptionbidonvilles/ui";
import LinkContact from "~/components/LinkContact/LinkContact.vue";

const i18n = useI18n();
const language = ref('fr')

watch(language, () => {
    i18n.locale.value = language.value
});

const { WEBAPP_URL } = useRuntimeConfig();

const emit = defineEmits(["closeMenu"]);
const navbarMobile = ref(null)

onMounted(() => {
    // Delay listener, otherwise the check happens before the menu is rendered and close the menu immediately
    setTimeout(() => {
        document.addEventListener("click", checkOutsideClick);
    }, 0);
})

onUnmounted(() => {
    document.removeEventListener("click", checkOutsideClick);
})

function checkOutsideClick(event) {
    if (!navbarMobile.value.contains(event.target)) {
        emit('closeMenu');
    }
}
</script>
