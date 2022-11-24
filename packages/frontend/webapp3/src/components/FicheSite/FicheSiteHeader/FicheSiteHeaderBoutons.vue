<template>
    <p class="flex space-x-2">
        <RouterLink
            to="#journal_du_site"
            v-if="
                userStore.hasLocalizedPermission(
                    'shantytown_comment.list',
                    town
                ) ||
                userStore.hasLocalizedPermission(
                    'shantytown_comment.create',
                    town
                )
            "
        >
            <Button
                size="sm"
                variant="primaryOutline"
                icon="comment"
                iconPosition="left"
                >Journal du site</Button
            >
        </RouterLink>
        <Button
            v-if="
                userStore.hasLocalizedPermission('shantytown.close', town) &&
                town.status === 'open'
            "
            size="sm"
            variant="primary"
            icon="house-circle-xmark"
            iconPosition="left"
            :href="`/site/${town.id}/fermeture`"
            >Fermer le site</Button
        >
        <Button
            size="sm"
            icon="file-word"
            iconPosition="left"
            variant="primary"
            @click="modalExport.open()"
            >Exporter</Button
        >
        <Button
            v-if="
                userStore.hasLocalizedPermission(
                    'shantytown.fix_status',
                    town
                ) && town.status !== 'open'
            "
            size="sm"
            variant="primary"
            icon="house-circle-xmark"
            iconPosition="left"
            :href="`/site/${town.id}/fermeture`"
            >Corriger la fermeture du site</Button
        >
        <Button
            size="sm"
            variant="primary"
            icon="pencil"
            iconPosition="left"
            v-if="
                userStore.hasLocalizedPermission('shantytown.update', town) &&
                town.status === 'open'
            "
            :href="`/site/${town.id}/mise-a-jour`"
            >Mettre à jour</Button
        >
        <Button
            v-if="userStore.hasLocalizedPermission('shantytown.delete', town)"
            size="sm"
            variant="secondary"
            icon="fa-regular fa-trash-alt"
            iconPosition="left"
            @click="deleteTown"
            :loading="deleteIsLoading"
            >Supprimer le site</Button
        >
    </p>

    <FicheSiteModaleExport :town="town" ref="modalExport" />
</template>

<script setup>
import { defineProps, toRefs, ref, nextTick } from "vue";
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import { useNotificationStore } from "@/stores/notification.store";
import { useTownsStore } from "@/stores/towns.store";
import router from "@/helpers/router";

import { Button } from "@resorptionbidonvilles/ui";
import FicheSiteModaleExport from "../FicheSiteModaleExport/FicheSiteModaleExport.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const userStore = useUserStore();
const modalExport = ref(null);

const deleteIsLoading = ref(false);
async function deleteTown() {
    if (deleteIsLoading.value === true) {
        return;
    }

    if (
        !confirm(
            "Êtes-vous sûr(e) de vouloir supprimer définitivement ce site ? Cette suppression est irréversible."
        )
    ) {
        return;
    }

    deleteIsLoading.value = true;

    try {
        const notificationStore = useNotificationStore();
        const townsStore = useTownsStore();
        router.replace("/liste-des-sites");

        nextTick(async () => {
            await townsStore.destroy(town.value.id);
            notificationStore.success(
                "Suppression du site",
                "Le site a été supprimé définitivement de la base"
            );
        });
    } catch (e) {
        alert(
            e?.user_message ||
                "Une erreur inconnue est survenue, la suppression n'a peut-être pas réussi"
        );
    }

    deleteIsLoading.value = false;
}
</script>
