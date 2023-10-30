<template>
    <Container class="h-full flex flex-col justify-center">
        <header>
            <RbLogo class="mx-auto" />
            <h1 class="font-bold text-display-md text-center mt-6 mb-4">
                Fin de l'application mobile
            </h1>

            <div class="max-w-256 mx-auto">
                <p>
                    L'application mobile n'ayant pas obtenu les résultats
                    escomptés, sa maintenance est arrêtée.
                </p>
                <p class="mt-4">
                    Vous pouvez toujours accéder à la version "navigateur"
                    plateforme depuis votre mobile.
                </p>
                <p class="text-center py-6">
                    <span class="inline-block border border-primary rounded p-4"
                        ><Link :to="VITE_WEBAPP_URL"
                            >Aller sur la plateforme</Link
                        ></span
                    >
                </p>
                <p>
                    Si des fonctionnalités qu'offraient la version mobile vous
                    manquent, vous pouvez nous en faire part à
                    <Link :to="`mailto:${VITE_MOBILE_CONTACT_EMAIL}`">{{
                        VITE_MOBILE_CONTACT_EMAIL
                    }}</Link>
                </p>
            </div>
        </header>
    </Container>
</template>

<script>
import Container from "#src/js/components/Container.vue";
import { Link, RbLogo } from "@resorptionbidonvilles/ui";
import ENV from "#src/env.js";

export default {
    components: {
        Container,
        Link,
        RbLogo,
    },
    data() {
        return {
            VITE_WEBAPP_URL: ENV.VITE_WEBAPP_URL,
            VITE_MOBILE_CONTACT_EMAIL: ENV.VITE_MOBILE_CONTACT_EMAIL,
        };
    },
};
</script>
