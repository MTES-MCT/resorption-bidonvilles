<template>
    <p class="font-bold">
        Désactiver un compte
        <span class="font-italic">Résorption-bidonvilles</span>
    </p>
    <p>
        Si vous n'intervenez plus sur la question des bidonvilles et squats en
        France, vous pouvez alors désactiver votre compte en cliquant sur le
        bouton ci-dessous.
    </p>
    <p class="mt-2">
        Vous n'aurez plus accès à la plateforme ni ne serez sollicité(e) par
        courriel.
    </p>
    <p class="mt-2 underline">
        Cette action est réversible uniquement sur demande à votre
        administrateur local.
    </p>

    <p class="mt-6">
        <Button
            variant="primary"
            icon="fa-regular fa-trash-alt"
            iconPosition="left"
            @click="confirmDeactivation"
            >{{
                self ? "Désactiver mon compte" : "Désactiver ce compte"
            }}</Button
        >
    </p>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";

import { Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});
const { user } = toRefs(props);

const self = computed(() => {
    const userStore = useUserStore();
    return user.value.id === userStore.user?.id;
});

function confirmDeactivation() {
    const wording = ["Êtes-vous sûr de vouloir désactiver le compte ?"];
    if (self.value === true) {
        wording.push("Vous serez automatiquement déconnecté(e).");
    }

    confirm(wording.join(" "));
}
</script>
