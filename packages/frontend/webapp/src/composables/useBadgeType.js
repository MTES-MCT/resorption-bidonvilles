import { computed } from "vue";
import getSince from "@/utils/getSince";

/**
 * Composable pour gérer le type de badge de manière réactive
 * @param {Ref<object> | object} town
 */
export default function useStatusBadge(town) {
    const badgeType = computed(() => {
        const dateCreated = town.value.createdAt;
        const dateUpdate = town.value.lastUpdatedAt;
        const dateLastUpdate = town.value.lastUpdatedAt;

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

    return { badgeType };
}
