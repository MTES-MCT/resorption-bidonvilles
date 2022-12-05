<template>
    <p class="flex space-x-2">
        <RouterLink
            to="#journal_de_l_action"
            v-if="userStore.hasLocalizedPermission('plan_comment.list', plan)"
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
            v-if="plan.closed_at === null"
            size="sm"
            variant="primary"
            icon="house-circle-xmark"
            iconPosition="left"
            :disabled="!plan.canClose || true"
            :href="`/action/${plan.id}/fermeture`"
            @click="unavailable"
            >Fermer l'action</Button
        >
        <Button
            v-if="plan.closed_at === null"
            size="sm"
            variant="primary"
            icon="pencil"
            iconPosition="left"
            :disabled="!plan.canUpdate || true"
            :href="`/action/${plan.id}/mise-a-jour`"
            @click="unavailable"
            >Mettre à jour</Button
        >
        <Button
            v-if="plan.closed_at === null"
            size="sm"
            variant="primary"
            icon="pencil"
            iconPosition="left"
            :disabled="!plan.canUpdateMarks || true"
            :href="`/action/${plan.id}/indicateurs/mise-a-jour`"
            @click="unavailable"
            >Mettre à jour les indicateurs</Button
        >
    </p>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import { Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);
const userStore = useUserStore();

function unavailable() {
    alert(
        "Ce formulaire est temporairement indisponible, pour des raisons techniques"
    );
}
</script>
