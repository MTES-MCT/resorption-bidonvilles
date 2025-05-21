import { computed } from "vue";
import departementsInResoprtionPhases from "@/utils/departements_in_resorption_phases";

export function usePhasesPreparatoiresResorption(town) {
    const displayPhasesPreparatoiresResorption = computed(() => {
        return departementsInResoprtionPhases.includes(
            parseInt(town.value.departement.code, 10)
        );
    });

    return {
        displayPhasesPreparatoiresResorption,
    };
}
