<template>
    <div class="flex flex-row justify-center mt-4 w-full max-w-md">
        <Button variant="secondary" class="ml-1" :href="`${WEBAPP_URL}/contact?acces`" @click="setWebappDevice">{{
            $t("landingPage.contactForm.ctaSignup")
        }}</Button>
        <Button variant="primary" class="ml-1" :href="`${WEBAPP_URL}/contact`" @click="setWebappDevice">{{
            $t("landingPage.contactForm.ctaContact")
        }}</Button>
    </div>
</template>

<script>
import { Button } from "@resorptionbidonvilles/ui";
import setWebappDevice from "~~/utils/setWebappDevice";

export default {
    components: {
        Button
    },
    data() {
        const { WEBAPP_URL } = useRuntimeConfig();
        return {
            WEBAPP_URL
        };
    },
    methods: {
        setWebappDevice,
    }
};
</script>