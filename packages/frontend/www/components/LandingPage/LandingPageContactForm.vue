<template>
    <div class="flex flex-row justify-center mt-4 w-full max-w-md">
        <ButtonContact v-if="i18n.locale.value === 'fr'" variant="primary" class="ml-1" isDemandeAcces>{{
            $t("landingPage.contactForm.ctaSignup")
        }}</ButtonContact>
        <ButtonContact v-else variant="primary" class="ml-1">{{
            $t("landingPage.contactForm.ctaContact")
        }}</ButtonContact>
    </div>
</template>

<script>
import ButtonContact from "~~/components/ButtonContact/ButtonContact.vue";
import { useI18n } from 'vue-i18n';

export default {
    components: {
        ButtonContact
    },
    setup() {
        const i18n = useI18n();
        return {
            i18n
        };
    },
};
</script>