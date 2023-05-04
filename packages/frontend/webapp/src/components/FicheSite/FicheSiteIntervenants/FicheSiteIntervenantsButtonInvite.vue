<template>
    <Button
        class="font-bold"
        variant="primaryOutlineAlt"
        icon="plus"
        iconPosition="left"
        @click="openInviteActorModal"
    >
        <slot>Inviter un intervenant</slot>
    </Button>
</template>

<script setup>
import { useEventBus } from "@common/helpers/event-bus.js";
import { Button } from "@resorptionbidonvilles/ui";

function openInviteActorModal() {
    const { emit } = useEventBus();
    emit("fichesite:openInviteActorModal");
}
</script>
