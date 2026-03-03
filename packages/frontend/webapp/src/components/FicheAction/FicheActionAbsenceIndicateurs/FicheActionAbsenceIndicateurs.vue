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
            <DsfrButton
                primary
                icon="fr-icon-pencil-line"
                @click="moveToUpdate"
                label="Mettre à jour"
            />
        </p>
    </FicheRubrique>
</template>

<script setup>
import { toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import router from "@/helpers/router";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
const userStore = useUserStore();

const isClosed = computed(() => {
    return action.value.ended_at && action.value.ended_at < Date.now();
});

const moveToUpdate = () => {
    router.push(`/action/${action.value.id}/mise-a-jour`);
};
</script>
