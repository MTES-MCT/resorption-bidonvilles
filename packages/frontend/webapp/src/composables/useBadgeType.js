import { computed, ref } from "vue";
import getSince from "@/utils/getSince";

/**
 * Composable pour gérer le type de badge de manière réactive
 * @param {Ref<string> | string} updatedAt
 * @param {Ref<string> | string} lastUpdatedAt
 */
export default function useStatusBadge(town) {
    const townForLastUpdate = ref({
        createdAt: town.value.createdAt,
        updatedAt: town.value.lastUpdatedAt,
        lastUpdatedAt: town.value.lastUpdatedAt,
    });
    const badgeType = computed(() => {
        const dateCreated = townForLastUpdate.value.createdAt;
        const dateUpdate = townForLastUpdate.value.updatedAt;
        const dateLastUpdate = townForLastUpdate.value.lastUpdatedAt;

        let type = "success";

        const { months: monthsSinceCreation } = getSince(dateCreated);
        const { months } = getSince(dateLastUpdate);
        const { months: monthsSinceLastUpdate } = getSince(dateUpdate);

        if (monthsSinceLastUpdate >= 6) {
            type = "error";
        } else if (
            monthsSinceCreation >= 3 &&
            monthsSinceCreation < 6 &&
            monthsSinceLastUpdate >= 3 &&
            monthsSinceLastUpdate < 6 &&
            months >= 3 &&
            months < 6
        ) {
            type = "warning";
        }

        return type;
    });

    return {
        badgeType,
    };
}
