<template>
    <section class="shadow-lg p-6">
        <div class="xl:flex xl:justify-between mb-8 lg:mb-4">
            <h2 class="text-2xl xl:text-3xl text-primary">{{ title }}</h2>
            <div class="flex flex-col">
                <Button
                    v-if="category === 'procedure'"
                    size="sm"
                    icon="user-group"
                    iconPosition="left"
                    variant="primaryText"
                    @click="openListAccesPJ"
                >
                    Qui a accès aux données sur la procédure ?
                </Button>
                <Button
                    v-if="title === 'Financements'"
                    size="sm"
                    icon="user-group"
                    iconPosition="left"
                    variant="primaryText"
                    @click="openListAccesActionFinances"
                >
                    Qui a accès aux données sur les financements ?
                </Button>
                <Button
                    class="lg:mb-4 xl:mb-0"
                    v-if="category"
                    size="sm"
                    icon="history"
                    iconPosition="left"
                    variant="primaryText"
                    @click="openHistorique"
                >
                    voir l'historique des modifications
                </Button>
            </div>
        </div>
        <slot />
    </section>
</template>

<script setup>
import { useEventBus } from "@common/helpers/event-bus.js";
import { toRefs } from "vue";

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

function openListAccesActionFinances() {
    emit("ficheactionfinancements:openListAccesActionFinancements");
}
</script>
