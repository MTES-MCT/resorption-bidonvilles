<template>
    <div class="fixed z-10 top-0 left-0 w-full bg-white shadow">
        <PublicContainer>
            <header
                role="navigation"
                class="py-4 flex flex-row justify-between items-center"
            >
                <NavBarLogo />
                <!-- Desktop actions -->
                <div class="hidden md:block">
                    <router-link to="/contact" class="mr-2">
                        <Button variant="secondary">{{
                            $t("landingPage.header.contact")
                        }}</Button>
                    </router-link>
                    <router-link to="/connexion">
                        <Button variant="primary">{{
                            $t("landingPage.header.connect")
                        }}</Button>
                    </router-link>
                </div>

                <NavBarMobileButton class="md:hidden" :onClick="toggleMenu" />
            </header>
        </PublicContainer>
    </div>
</template>

<script>
import NavBarLogo from "./NavBarLogo.vue";
import NavBarMobileButton from "./NavBarMobileButton.vue";
import PublicContainer from "../PublicContainer.vue";
import Button from "#app/components/ui/Button.vue";

export default {
    props: {
        menuDisplayed: {
            type: Boolean,
            required: true
        },
        toggleMenu: {
            type: Function,
            required: true
        }
    },
    components: {
        NavBarLogo,
        Button,
        NavBarMobileButton,
        PublicContainer
    }
};
</script>
