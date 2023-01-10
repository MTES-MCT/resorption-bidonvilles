<template>
    <section class="shadow-lg p-6">
        <div class="flex justify-between">
            <h1 class="text-3xl text-primary">{{ title }}</h1>
            <Button
                size="sm"
                icon="history"
                iconPosition="left"
                variant="primaryText"
                @click="openHistorique"
                >voir l'historique des modifications</Button
            >
        </div>
        <slot />
    </section>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { useEventBus } from "@/helpers/event-bus";

import { Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    title: String,
});
const { title } = toRefs(props);
const { emit } = useEventBus();

function openHistorique() {
    emit("fichesite:openHistorique");
}
</script>
