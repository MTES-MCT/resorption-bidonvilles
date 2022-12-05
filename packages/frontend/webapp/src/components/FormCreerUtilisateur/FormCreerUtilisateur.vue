<template>
    <FormUtilisateur variant="creer-utilisateur" :submit="submit">
        <template v-slot:submit>Ajouter cet utilisateur</template>
    </FormUtilisateur>
</template>

<script setup>
import { create } from "@/api/users.api.js";
import router from "@/helpers/router.js";
import { useAccesStore } from "@/stores/acces.store";
import FormUtilisateur from "@/components/FormUtilisateur/FormUtilisateur.vue";

async function submit(values) {
    const accesStore = useAccesStore();
    const newUser = await create(values);
    accesStore.updateUser(newUser.id, newUser);
    router.push(`/acces/${newUser.id}`);
}
</script>
