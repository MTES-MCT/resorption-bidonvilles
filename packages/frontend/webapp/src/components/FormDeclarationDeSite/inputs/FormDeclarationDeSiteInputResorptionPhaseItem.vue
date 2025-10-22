<template>
    <div
        class="p-2 px-4 w-full"
        :class="{ 'border-1 border-primary rounded ': withBorder }"
    >
        <div
            class="grid grid-cols-2 gap-4 item-start"
            :class="{ 'mt-2 mb-1': withBorder }"
        >
            <Checkbox
                :value="phase.uid"
                :checked="isChecked"
                :key="phase.uid"
                :label="phase.name"
                name="preparatory_phases_toward_resorption"
                :modelValue="modelValue"
                :disabled="isDisabled"
                @change="handleCheckboxChange"
            />
            <DatepickerInput
                v-if="isChecked"
                :name="`phase_${phase.uid}_completed_at`"
                :id="`phase_${phase.uid}_completed_at`"
                :maxDate="new Date()"
                v-model="completed_date"
                class="!mb-0"
                :disabled="!canUpdate"
            />
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, ref } from "vue";
import { Checkbox, DatepickerInput } from "@resorptionbidonvilles/ui";
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

const { phase, activePhases, withBorder } = props;

const isDisabled = computed(
    () => phase.is_a_starting_phase || canUpdate.value === false
);

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

    // Mettre à jour activePhases pour la gestion des dates
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

    // Le v-model gère déjà l'ajout/suppression dans preparatory_phases_toward_resorption
    // Pas besoin de le faire manuellement
};

const canUpdate = computed(() => {
    const userStore = useUserStore();
    return userStore.hasPermission("shantytown.update");
});
</script>
