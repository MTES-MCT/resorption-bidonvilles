<template>
    <Button variant="secondary" class="xs:ml-1 sm:mr-4 my-4" @click="() => redirectToContact()">{{ $t("landingPage.firstBanner.cta") }}</Button>
    
    <Button variant="primary" class="xs:ml-1 my-4">{{
            $t("landingPage.contactForm.cta")
    }}</Button>
</template>

<script>
import { Button } from "@resorptionbidonvilles/ui";
import redirectToContact from "~~/utils/redirectToContact";

export default {
    components: {
        Button
    },
    data() {
        return {
            email: "",
        };
    },
    methods: {
        onSubmit() {
            redirectToContact(this.email);
        }
    }
};
</script>