<template>
    <p class="flex space-x-2">
        <RouterLink
            to="#newComment"
            @click="scrollFix('#newComment')"
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
            @click="$emit('openCancel')"
            >Fermer le site</Button
        >
        <Button
            size="sm"
            icon="file-word"
            iconPosition="left"
            variant="primary"
            @click="showExport"
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
            @click="$emit('openCancel')"
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
            @click="routeToUpdate"
            >Mettre à jour</Button
        >
        <Button
            v-if="userStore.hasLocalizedPermission('shantytown.delete', town)"
            size="sm"
            variant="secondary"
            icon="fa-regular fa-trash-alt"
            iconPosition="left"
            @click="$emit('deleteTown')"
            >Supprimer le site</Button
        >
    </p>
</template>

<script setup>
import { defineProps, toRefs, defineEmits } from "vue";
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import { Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const userStore = useUserStore();
defineEmits(["openCancel", "deleteTown"]);

function scrollFix() {}

function routeToUpdate() {}

function showExport() {}
</script>
