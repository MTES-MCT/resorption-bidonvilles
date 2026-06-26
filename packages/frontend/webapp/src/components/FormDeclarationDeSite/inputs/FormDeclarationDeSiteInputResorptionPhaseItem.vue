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
import { useFormValues } from "vee-validate";
import { DatepickerInput } from "@resorptionbidonvilles/ui";
import { useUserStore } from "@/stores/user.store";

const props = defineProps({
    phase: {
        type: Object,
        required: true,
    },
    activePhases: {
        type: Array,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
    modelValue: {
        type: [Array, String, Number, Boolean],
        required: true,
        default: undefined,
    },
    withBorder: {
        type: Boolean,
        default: true,
    },
});

const { phase, activePhases } = toRefs(props);

const initialDate = ref(null);
const canUpdate = computed(() => {
    const userStore = useUserStore();
    return userStore.hasPermission("shantytown.update");
});

const getAssociatedPhase = () =>
    activePhases.value.find((p) => p.preparatoryPhaseId === phase.value.uid);

const phaseStatus = computed({
    get() {
        const associatedPhase = getAssociatedPhase();
        if (!associatedPhase) {
            return "not_started";
        }
        return associatedPhase.completedAt ? "completed" : "started";
    },
    set(newStatus) {
        const index = activePhases.value.findIndex(
            (p) => p.preparatoryPhaseId === phase.value.uid
        );

        if (newStatus === "not_started") {
            initialDate.value = completedDate.value;
            if (index > -1) {
                activePhases.value.splice(index, 1);
            }
        } else {
            const resolvedDate =
                newStatus === "completed"
                    ? initialDate.value || completedDate.value || new Date()
                    : null;

            const updatedPhase = {
                preparatoryPhaseId: phase.value.uid,
                completedAt: resolvedDate ? resolvedDate.toISOString() : null,
            };

            if (index > -1) {
                activePhases.value[index] = updatedPhase;
            } else {
                activePhases.value.push(updatedPhase);
            }

            if (newStatus === "completed") {
                initialDate.value = null;
            }
        }
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
        const associatedPhase = getAssociatedPhase();
        if (associatedPhase) {
            associatedPhase.completedAt = newDate
                ? newDate.toISOString()
                : null;
        }
    },
});

const values = useFormValues();
const fieldName = `phase_${props.phase.uid}_completed_at`;

watch(
    completedDate,
    (newVal) => {
        if (values.value && values.value[fieldName] !== newVal) {
            values.value[fieldName] = newVal;
        }
    },
    { immediate: true }
);

watch(
    () => values.value?.[fieldName],
    (newVal) => {
        if (newVal === undefined) {
            return;
        }
        const getTimestamp = (val) => {
            if (val instanceof Date) {
                return val.getTime();
            }
            if (val) {
                return new Date(val).getTime();
            }
            return null;
        };
        if (getTimestamp(newVal) !== getTimestamp(completedDate.value)) {
            completedDate.value = newVal ? new Date(newVal) : null;
        }
    }
);
</script>
<style scoped>
/* Rattrapage du mt-3 de la div enfant du DatePicker */
.mt-0 {
    margin-top: -0.75rem !important;
}
</style>
