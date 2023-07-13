<template>
    <div class="flex flex-row justify-center mt-4 w-full max-w-md">
        <ButtonContact variant="primary" class="ml-1" isDemandeAcces>{{
            $t("landingPage.contactForm.ctaSignup")
        }}</ButtonContact>
    </div>
</template>

<script>
import ButtonContact from "~~/components/ButtonContact/ButtonContact.vue";

export default {
    components: {
        ButtonContact
    },
};
</script>