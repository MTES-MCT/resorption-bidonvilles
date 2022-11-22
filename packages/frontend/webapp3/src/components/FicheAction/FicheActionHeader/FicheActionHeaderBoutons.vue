<template>
    <p class="flex space-x-2">
        <RouterLink
            to="#newComment"
            @click="scrollFix('#newComment')"
            v-if="
                userStore.hasLocalizedPermission('plan_comment.list', plan) ||
                userStore.hasLocalizedPermission('plan_comment.create', plan)
            "
        >
            <Button
                size="sm"
                variant="primaryOutline"
                icon="comment"
                iconPosition="left"
                >Journal de l'action</Button
            >
        </RouterLink>
        <Button
            v-if="plan.canClose && plan.closed_at === null"
            size="sm"
            variant="primary"
            icon="house-circle-xmark"
            iconPosition="left"
            @click="$emit('closePlan')"
            >Fermer l'action</Button
        >

        <Button
            size="sm"
            variant="primary"
            icon="pencil"
            iconPosition="left"
            v-if="plan.canUpdate && plan.closed_at === null"
            @click="routeToUpdate"
            >Mettre à jour</Button
        >
        <Button
            size="sm"
            variant="primary"
            icon="pencil"
            iconPosition="left"
            v-if="plan.canUpdateMarks && plan.closed_at === null"
            @click="routeToUpdateMarks"
            >Mettre à jour les indicateurs</Button
        >
    </p>
</template>

<script setup>
import { defineProps, toRefs, defineEmits } from "vue";
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import { Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);
const userStore = useUserStore();
defineEmits(["closePlan"]);

function scrollFix() {}

function routeToUpdate() {}

function routeToUpdateMarks() {}
</script>
