<template>
    <!-- actions en cours -->
    <FicheSiteActionsSection :actions="actions.onGoing">
        <template v-slot:title>Actions en cours</template>
        <template v-slot:empty
            >Il n'y a aucune action en cours sur ce site.</template
        >
    </FicheSiteActionsSection>

    <!-- actions terminées-->
    <template v-if="actions.ended.length > 0">
        <RbButton class="mt-4" @click="toggleEndedActions">{{
            endedActionsWording
        }}</RbButton>
        <FicheSiteActionsSection
            v-if="showEndedActions"
            :actions="actions.ended"
            class="mt-6"
        >
            <template v-slot:title>Actions terminées</template>
        </FicheSiteActionsSection>
    </template>
</template>

<script setup>
import { computed, ref, toRefs } from "vue";
import { Button as RbButton } from "@resorptionbidonvilles/ui";
import FicheSiteActionsSection from "./FicheSiteActionsSection.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const actions = computed(() => {
    return town.value.actions.reduce(
        (acc, action) => {
            if (action.is_ended) {
                acc.ended.push(action);
            } else {
                acc.onGoing.push(action);
            }

            return acc;
        },
        { onGoing: [], ended: [] }
    );
});

const showEndedActions = ref(false);
const endedActionsWording = computed(() => {
    const total = actions.value.ended.length;

    return [
        showEndedActions.value === true ? "Masquer" : "Voir",
        total === 1
            ? "la seule action terminée"
            : `les ${total} actions terminées`,
    ].join(" ");
});

function toggleEndedActions() {
    showEndedActions.value = !showEndedActions.value;
}
</script>
