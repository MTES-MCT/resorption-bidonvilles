<template>
    <FicheRubrique title="Actions">
        <template v-if="town.closedAt === null">
            <section>
                <template v-if="actions.onGoing.length > 0">
                    <p>Actions en cours</p>
                    <div class="grid grid-cols-2 gap-4">
                        <CarteActionDeSite
                            v-for="action in actions.onGoing"
                            :key="action.id"
                            :action="action"
                        />
                    </div>
                </template>
                <p v-else>Il n'y a aucune action en cours sur ce site.</p>
            </section>

            <section v-if="actions.ended.length > 0" class="mt-6">
                <Button @click="toggleEndedActions"
                    >{{ showEndedActions ? "Masquer" : "Voir" }}
                    {{ actionEndedWording }}</Button
                >
                <div
                    class="grid grid-cols-2 gap-4 mt-4"
                    v-if="showEndedActions"
                >
                    <CarteActionDeSite
                        v-for="action in actions.ended"
                        :key="action.id"
                        :action="action"
                    />
                </div>
            </section>
        </template>

        <template v-else>
            <section>
                <template v-if="town.actions.length > 0">
                    <div class="grid grid-cols-2 gap-4">
                        <CarteActionDeSite
                            v-for="action in town.actions"
                            :key="action.id"
                            :action="action"
                        />
                    </div>
                </template>
                <p v-else>Ce site n'est lié à aucune action.</p>
            </section>
        </template>
    </FicheRubrique>
</template>

<script setup>
import { computed, ref, toRefs } from "vue";
import { Button } from "@resorptionbidonvilles/ui";
import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import CarteActionDeSite from "@/components/CarteActionDeSite/CarteActionDeSite.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const showEndedActions = ref(false);
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

const actionEndedWording = computed(() => {
    const total = actions.value.ended.length;
    return total === 1
        ? "la seule action terminée"
        : `les ${total} actions terminées`;
});

function toggleEndedActions() {
    showEndedActions.value = !showEndedActions.value;
}
</script>
