<template>
    <DsfrButton
        class="font-bold"
        tertiary
        no-outline
        icon="fr-icon-add-line"
        @click="openInviteActorModal"
    >
        <slot>Inviter un intervenant</slot>
    </DsfrButton>
</template>

<script setup>
import { useEventBus } from "@common/helpers/event-bus.js";

function openInviteActorModal() {
    const { emit } = useEventBus();
    emit("fichesite:openInviteActorModal");
}
</script>
