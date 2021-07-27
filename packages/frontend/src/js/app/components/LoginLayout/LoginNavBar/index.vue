<template>
    <div class="container px-10 mx-auto">
        <header
            role="navigation"
            class="py-6 flex flex-row justify-between items-center"
        >
            <NavBarLogo />
            <div class="flex items-center">
                <LoginNavBarLink to="/connexion">connexion</LoginNavBarLink>
                <LoginNavBarLink to="/contact" class="mx-8"
                    >demander un accès</LoginNavBarLink
                >
                <LoginNavBarLink
                    is="a"
                    class="uppercase hover:text-primary text-G600"
                    href="mailto:contact@resorption-bidonvilles.beta.gouv.fr"
                    >aide</LoginNavBarLink
                >
            </div>
        </header>
    </div>
</template>

<script>
import NavBarLogo from "./NavBarLogo.vue";
import LoginNavBarLink from "#app/components/LoginLayout/LoginNavBar/LoginNavBarLink";

export default {
    components: {
        LoginNavBarLink,
        NavBarLogo
    }
};
</script>
