<template>
    <FicheRubrique title="Indicateurs" id="indicateurs">
        <p class="mt-6 text-center">
            Il n'y a aucun indicateur renseigné par l'opérateur pour le moment.
        </p>

        <p
            class="text-center mt-4"
            v-if="
                !isClosed &&
                userStore.hasActionPermission('action.update', action)
            "
        >
            <Button
                variant="primary"
                class="ml-8"
                icon="pen"
                iconPosition="left"
                :href="`/action/${action.id}/mise-a-jour`"
                >Mettre à jour</Button
            >
        </p>
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import { Button } from "@resorptionbidonvilles/ui";
import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
const userStore = useUserStore();

const isClosed = computed(() => {
    return action.value.ended_at && action.value.ended_at < Date.now();
});
</script>
