<template>
    <div class="fr-container fr-my-2v">
        <h3 class="h3 font-bold flex flex-wrap gap-2 items-center">
            {{ phase.name }}
            <DsfrBadge
                v-if="completedDate"
                label="Validée"
                type="success"
                small
            />
            <DsfrBadge
                v-if="phaseStatus === 'started'"
                label="En cours"
                type="info"
                small
            />
        </h3>
        <div class="flex flex-col lg:flex-row gap-2 w-full">
            <DsfrSegmentedSet
                :options="[
                    { label: 'Non démarrée', value: 'not_started' },
                    { label: 'En cours', value: 'started' },
                    { label: 'Terminée', value: 'completed' },
                ]"
                v-model="phaseStatus"
                :disabled="
                    !canUpdate || (phase.is_a_starting_phase && completedDate)
                "
            />

            <DatepickerInput
                v-if="phaseStatus !== 'not_started'"
                :key="`phase_${phase.uid}_${phaseStatus}`"
                :name="`phase_${phase.uid}_completed_at`"
                :id="`phase_${phase.uid}_completed_at`"
                :maxDate="new Date()"
                v-model="completedDate"
                class="!mb-0 mt-0 w-64"
                :disabled="!canUpdate"
            />
        </div>
    </div>
</template>

<script setup>
import { computed, ref, toRefs, watch } from "vue";
import { useField } from "vee-validate";
import { DatepickerInput } from "@resorptionbidonvilles/ui";
import { useUserStore } from "@/stores/user.store";

const props = defineProps({
    phase: {
        type: Object,
        required: true,
    },
});

const { phase } = toRefs(props);

// Mémorise la dernière date saisie pour la restaurer si l'utilisateur
// repasse « Terminée » après être passé par « En cours » / « Non démarrée ».
const initialDate = ref(null);

const canUpdate = computed(() => {
    const userStore = useUserStore();
    return userStore.hasPermission("shantytown.update");
});

// Mécanisme repris de l'ancienne Checkbox : un useField en mode « checkbox »
// partageant le name `preparatory_phases_toward_resorption` maintient le tableau
// des UIDs cochés (source de vérité consommée par le backend). `handleChange(uid)`
// toggle la présence de l'UID, `checked` reflète cette présence.
const { checked, handleChange: togglePhaseUid } = useField(
    "preparatory_phases_toward_resorption",
    undefined,
    {
        type: "checkbox",
        checkedValue: phase.value.uid,
    }
);

// Garde le tableau d'UIDs et l'état coché alignés sur la cible voulue.
const setChecked = (shouldBeChecked) => {
    if (checked.value !== shouldBeChecked) {
        togglePhaseUid(phase.value.uid);
    }
};

// `active_preparatory_phases_toward_resorption` porte les dates de complétion.
// On l'écrit via handleChange (et non en mutant `values`, exposé en lecture seule
// par vee-validate) avec un tableau neuf à chaque fois pour préserver la réactivité.
const { value: activePhases, handleChange: setActivePhases } = useField(
    "active_preparatory_phases_toward_resorption"
);

const getAssociatedPhase = () =>
    (activePhases.value || []).find(
        (p) => p.preparatoryPhaseId === phase.value.uid
    );

const phaseStatus = computed({
    get() {
        const associatedPhase = getAssociatedPhase();
        if (!associatedPhase) {
            return "not_started";
        }
        return associatedPhase.completedAt ? "completed" : "started";
    },
    set(newStatus) {
        const others = (activePhases.value || []).filter(
            (p) => p.preparatoryPhaseId !== phase.value.uid
        );

        if (newStatus === "not_started") {
            initialDate.value = completedDate.value;
            setActivePhases(others);
            setChecked(false);
            return;
        }

        const resolvedDate =
            newStatus === "completed"
                ? initialDate.value || completedDate.value || new Date()
                : null;

        setActivePhases([
            ...others,
            {
                preparatoryPhaseId: phase.value.uid,
                completedAt: resolvedDate ? resolvedDate.toISOString() : null,
            },
        ]);

        if (newStatus === "completed") {
            initialDate.value = null;
        }

        setChecked(true);
    },
});

const completedDate = computed({
    get() {
        const associatedPhase = getAssociatedPhase();
        return associatedPhase?.completedAt
            ? new Date(associatedPhase.completedAt)
            : null;
    },
    set(newDate) {
        const others = (activePhases.value || []).filter(
            (p) => p.preparatoryPhaseId !== phase.value.uid
        );
        setActivePhases([
            ...others,
            {
                preparatoryPhaseId: phase.value.uid,
                completedAt: newDate ? newDate.toISOString() : null,
            },
        ]);
    },
});

// Le DatepickerInput possède son propre useField (name `phase_${uid}_completed_at`)
// et n'émet rien vers le parent quand on efface la date via sa croix (@cleared).
// On observe donc ce champ partagé pour propager l'effacement à la source de vérité
// `active_preparatory_phases_toward_resorption` : la phase repasse « En cours »
// (completedAt = null) et le DsfrSegmentedSet se repositionne sur « En cours ».
const { value: pickerDate } = useField(`phase_${phase.value.uid}_completed_at`);

watch(pickerDate, (newValue) => {
    const isCleared =
        newValue === null || newValue === undefined || newValue === "";
    // On ne réagit qu'à l'effacement d'une phase actuellement « Terminée »,
    // pour ne pas interférer avec la sélection normale d'une date.
    if (isCleared && phaseStatus.value === "completed") {
        completedDate.value = null;
    }
});
</script>
<style scoped>
/* Rattrapage du mt-3 de la div enfant du DatePicker */
.mt-0 {
    margin-top: -0.75rem !important;
}
</style>
