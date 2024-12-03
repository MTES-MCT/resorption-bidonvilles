<template>
    <!-- Phase active : {{ activePhases }} -->
    <div class="p-2 border-1 border-primary rounded">
        <!-- <div class="mb-4 text-xs">{{ phase }}</div> -->
        <div
            class="bg-G200 mb-2 p-1 rounded text-sm"
            v-if="phase.is_a_starting_phase"
        >
            Phase initiale
        </div>

        <div class="flex items-center gap-4">
            <Checkbox
                :value="phase.uid"
                :checked="isChecked"
                :key="phase.uid"
                :label="phase.name"
                name="preparatory_phases_toward_resorption"
                :disabled="isDisabled"
                v-model="modelValue"
                @change="handleCheckboxChange"
            />
            <DatepickerInput
                v-if="isChecked"
                :name="`phase_${phase.uid}_completed_at`"
                :id="`phase_${phase.uid}_completed_at`"
                :maxDate="new Date()"
                v-model="completed_date"
            />
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, ref } from "vue";
// import ItemCheckbox from "./FormDeclarationDeSiteInputResorptionPhasesItemCheckbox.vue";
import { Checkbox, DatepickerInput } from "@resorptionbidonvilles/ui";

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
});

const { phase, modelValue, activePhases } = props;

const isDisabled = computed(() => phase.is_a_starting_phase);

const isChecked = ref(false);

// Utiliser un ref modifiable
const completed_date = ref(null);

// Initialiser la valeur en fonction des phases actives
isChecked.value = activePhases.some(
    (activePhase) => activePhase.preparatoryPhaseId === phase.uid
);

// Initialiser le ref avec la date si elle existe
const activePhase = activePhases.find(
    (activePhase) => activePhase.preparatoryPhaseId === phase.uid
);

if (activePhase && activePhase.completedAt) {
    completed_date.value = new Date(activePhase.completedAt * 1000);
}

const handleCheckboxChange = (checked) => {
    isChecked.value = checked;
    if (checked) {
        if (
            !activePhases.some(
                (activePhase) => activePhase.preparatoryPhaseId === phase.uid
            )
        ) {
            activePhases.push({ preparatoryPhaseId: phase.uid });
        }
    } else {
        const index = activePhases.findIndex(
            (activePhase) => activePhase.preparatoryPhaseId === phase.uid
        );
        if (index > -1) {
            activePhases.splice(index, 1);
        }
    }
};
</script>
