import { ref, computed, watch } from "vue";
import coloreUpdatedSince from "@/utils/coloreUpdatedSince";
import formatDate from "@common/utils/formatDate.js";
import formatLastUpdatedAt from "@/utils/formatLastUpdatedAt";

export default function useLastUpdated(town) {
    const townForLastUpdate = ref({
        createdAt: town.value.createdAt,
        updatedAt: town.value.lastUpdatedAt,
        lastUpdatedAt: town.value.lastUpdatedAt,
    });

    function updateTownStatus() {
        let townStatusReturned = null;
        if (town.value.closedAt && town.value.closedWithSolutions !== "yes") {
            townStatusReturned = `Fermé le ${formatDate(
                town.value.closedAt,
                "d/m/y"
            )}`;
        } else if (
            town.value.closedAt &&
            town.value.closedWithSolutions === "yes"
        ) {
            townStatusReturned = `Résorbé le ${formatDate(
                town.value.closedAt,
                "d/m/y"
            )}`;
        } else {
            townStatusReturned = formatLastUpdatedAt(townForLastUpdate.value);
        }
        return townStatusReturned;
    }

    const lastUpdatedAtDotColor = computed(() => {
        if (town.value.closedAt && town.value.closedWithSolutions !== "yes") {
            return "bg-red";
        } else if (
            town.value.closedAt &&
            town.value.closedWithSolutions === "yes"
        ) {
            return "bg-green";
        }
        return coloreUpdatedSince(town.value);
    });

    const lastUpdatedAt = computed(() => {
        return town.value.lastUpdatedAt;
    });

    const townStatus = computed(() => {
        return updateTownStatus();
    });

    watch(
        lastUpdatedAt,
        (newValue) => {
            if (newValue) {
                townForLastUpdate.value.lastUpdatedAt = newValue;
            }
        },
        { immediate: true }
    );

    return {
        townStatus,
        townForLastUpdate,
        lastUpdatedAtDotColor,
    };
}
