<template>
    <Layout hero v-if="greeter">
        <FormInvitation
            :greeter="greeter"
            :from="from"
            :showSkip="!userStore.user"
        />
    </Layout>

    <LayoutError hero v-else>
        <template v-slot:title>Impossible d'envoyer des invitations</template>
        <template v-slot:code
            >Utilisateur à l'origine des invitations introuvable</template
        >
        <template v-slot:content>
            <p>
                Vous souhaitiez inviter vos contacts à agir pour la résorption
                des bidonvilles, cependant nous ne retrouvons pas vos
                informations de contact permettant d'émettre les invitations.
            </p>
            <p class="mt-4">
                N'hésitez pas à nous contacter pour nous aider à corriger ce
                problème.
            </p>
        </template>
    </LayoutError>
</template>

<script setup>
import { computed } from "vue";
import router from "@/helpers/router.js";
import { useUserStore } from "@/stores/user.store";

import Layout from "@/components/Layout/Layout.vue";
import FormInvitation from "@/components/FormInvitation/FormInvitation.vue";
import LayoutError from "@/components/LayoutError/LayoutError.vue";

const userStore = useUserStore();
const greeter = computed(() => {
    if (userStore.user) {
        return {
            email: userStore.user.email,
            first_name: userStore.user.first_name,
            last_name: userStore.user.last_name,
        };
    }

    const { email, first_name, last_name } = router.currentRoute.value.query;
    if (
        email !== undefined &&
        first_name !== undefined &&
        last_name !== undefined
    ) {
        return {
            email,
            first_name,
            last_name,
        };
    }

    return null;
});

const from = computed(() => {
    return router.currentRoute.value.query.from || "unknown";
});
</script>
