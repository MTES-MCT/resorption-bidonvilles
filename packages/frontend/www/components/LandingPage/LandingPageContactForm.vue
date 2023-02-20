<template>
    <div class="flex flex-row justify-center mt-4 w-full max-w-md">
        <ButtonContact variant="secondary" class="ml-1" isDemandeAcces>{{
            $t("landingPage.contactForm.ctaSignup")
        }}</ButtonContact>
        <ButtonContact variant="primary" class="ml-1">{{
            $t("landingPage.contactForm.ctaContact")
        }}</ButtonContact>
    </div>
</template>

<script>
import ButtonContact from "~~/components/ButtonContact/ButtonContact.vue";

export default {
    components: {
        ButtonContact
    },
    data() {
        const { WEBAPP_URL } = useRuntimeConfig();
        return {
            WEBAPP_URL
        };
    }
};
</script>