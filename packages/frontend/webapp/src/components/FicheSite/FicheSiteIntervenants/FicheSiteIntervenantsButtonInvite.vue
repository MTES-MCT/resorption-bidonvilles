<template>
    <DsfrButton
        class="font-bold"
        secondary
        icon="fr-icon-user-add-fill"
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
