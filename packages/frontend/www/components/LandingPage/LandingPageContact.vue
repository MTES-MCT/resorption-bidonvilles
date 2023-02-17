<template>
    <Button type="button" variant="secondary" class="xs:ml-1 sm:mr-4 my-4" @click="routeToAccessRequest">{{
        $t("landingPage.firstBanner.cta") }}</Button>

    <Button type="button" variant="primary" class="xs:ml-1 my-4" @click="routeToContact">{{
        $t("landingPage.contactForm.cta")
    }}</Button>
</template>

<script>
import { Button } from "@resorptionbidonvilles/ui";
import redirectToContact from "~~/utils/redirectToContact";
import redirectToAccessRequest from "~~/utils/redirectToAccessRequest";

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
        routeToAccessRequest() {
            redirectToAccessRequest();
        },
        routeToContact() {
            redirectToContact();
        }
    }
};
</script>