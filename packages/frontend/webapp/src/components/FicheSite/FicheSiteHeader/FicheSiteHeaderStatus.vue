<template>
    <div class="flex flex-col">
        <div class="flex items-center uppercase text-sm">
            <DsfrBadge
                :type="badgeType"
                noIcon
                :label="townStatus"
                class="mr-4 text-xs"
            />
            <BadgeSiteObjectifResorption
                v-if="town.resorptionTarget"
                :target="town.resorptionTarget"
                class="mr-4"
            />
        </div>
        <FicheSiteHeaderStatusLastEvent
            v-if="town.changelog.length || town.comments.length"
            :town="town"
        />
        <div v-else>
            <p class="text-black">
                Site déclaré le
                {{ formatDate(town.createdAt, "d M y") }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { computed, toRefs } from "vue";
import useLastUpdated from "@/composables/useLastUpdated";
import FicheSiteHeaderStatusLastEvent from "@/components/FicheSite/FicheSiteHeader/FicheSiteHeaderStatusLastEvent.vue";
import BadgeSiteObjectifResorption from "@/composables/BadgeSiteOjectifResorption.vue";
import getStatusBadgeType from "@/utils/getStatusBadgeType";
import formatDate from "@common/utils/formatDate";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const { townStatus } = useLastUpdated(town);

const badgeType = computed(() => {
    if (town.value.closedAt && town.value.closedWithSolutions !== "yes") {
        return "error";
    } else if (
        town.value.closedAt &&
        town.value.closedWithSolutions === "yes"
    ) {
        return "success";
    }
    return getStatusBadgeType(town.value.updatedAt, town.value.lastUpdatedAt);
});
</script>
