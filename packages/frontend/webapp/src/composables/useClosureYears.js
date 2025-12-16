import { ref, onMounted } from "vue";
import { getClosureYearRange } from "@/api/towns.api";

export default function useClosureYears() {
    const closureYears = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    const fetchClosureYears = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const data = await getClosureYearRange();
            const minYear = Number(data?.minYear ?? data?.min_year);
            const maxYear = Number(data?.maxYear ?? data?.max_year);

            if (!Number.isFinite(minYear) || !Number.isFinite(maxYear)) {
                throw new Error("Invalid closure year range");
            }

            const startYear = Math.max(minYear, maxYear);
            const endYear = Math.min(minYear, maxYear);

            const years = [];
            for (let year = startYear; year >= endYear; year--) {
                years.push({
                    value: year.toString(),
                    label: year.toString(),
                });
            }
            closureYears.value = years;
        } catch (e) {
            error.value =
                e?.user_message ||
                "Erreur lors de la récupération des années de fermeture";
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        fetchClosureYears();
    });

    return {
        closureYears,
        isLoading,
        error,
        fetchClosureYears,
    };
}
