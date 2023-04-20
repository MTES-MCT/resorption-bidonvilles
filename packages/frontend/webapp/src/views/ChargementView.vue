<template>
    <LayoutLoading v-if="error === null" />

    <LayoutError v-else>
        <template v-slot:title>Erreur de chargement</template>
        <template v-slot:code>{{ error }}</template>
        <template v-slot:content>
            <p>
                Vous souhaitiez agir pour la résorption des bidonvilles mais il
                semblerait que la plateforme rencontre un soucis technique.
            </p>
            <p class="mt-6">
                Essayez de rafraîchir la page ou de revenir plus tard.<br />
                Si vous avez besoin d'une aide immédiate, merci de nous
                contacter.
            </p>
        </template>
        <template v-slot:actions>
            <Button
                icon="rotate-right"
                iconPosition="left"
                type="button"
                @clicked="load"
                >Rafraîchir</Button
            >
            <ButtonContact />
        </template>
    </LayoutError>
</template>

<script setup>
// utils
import { onMounted, ref } from "vue";
import router from "@/helpers/router";
import { trackLogin } from "@/helpers/matomo";
import { useConfigStore } from "@/stores/config.store.js";
import { useUserStore } from "@/stores/user.store.js";
import { useEventBus } from "@common/helpers/event-bus.js";

// components
import { Button } from "@resorptionbidonvilles/ui";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import LayoutError from "@/components/LayoutError/LayoutError.vue";

const isLoading = ref(null);
const error = ref(null);

async function load() {
    if (isLoading.value === true) {
        return;
    }

    const configStore = useConfigStore();
    const userStore = useUserStore();
    const { emit } = useEventBus();

    isLoading.value = true;
    error.value = null;
    try {
        await configStore.load();
        trackLogin(userStore.user);
        router.push("/");
        emit("new-user", userStore.user);
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
    }

    isLoading.value = false;
}

onMounted(load);
</script>
