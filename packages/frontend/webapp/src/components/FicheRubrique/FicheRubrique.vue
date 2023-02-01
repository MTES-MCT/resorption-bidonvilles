<template>
    <section class="shadow-lg p-6">
        <div class="flex justify-between">
            <h1 class="text-3xl text-primary">{{ title }}</h1>
            <div>
                <Button v-if="category == 'justice'" size="sm" icon="user-group" iconPosition="left"
                    variant="primaryText" @click="openListAccesPJ">
                    Qui a accès aux données judiciaires de ce site ?
                </Button>
                <Button v-if="category" size="sm" icon="history" iconPosition="left" variant="primaryText"
                    @click="openHistorique">
                    voir l'historique des modifications
                </Button>
            </div>
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
    category: String,
});
const { title, category } = toRefs(props);
const { emit } = useEventBus();

function openHistorique() {
    emit("fichesite:openHistorique", category.value);
}

function openListAccesPJ() {
    emit("fichesitepj:openListAccesPJ");
}
</script>
