<template>
    <header class="px-6 flex flex-col lg:flex-row justify-between">
        <div class="flex-col sm:flex-row">
            <DsfrBadge
                :type="badgeType"
                :label="townStatus"
                class="mt-1 items-center text-xs py-2 mr-2"
            />
            <DsfrBadge
                v-if="heatwaveStatus === true"
                label="Risque Canicule"
                type="warning"
                class="mt-1 items-center text-xs py-2 mr-2"
            />
            <BadgeSiteOjectifResorption
                :resorption-target="shantytown.resorptionTarget"
            />
        </div>
        <div class="flex right-14" v-if="attachmentsLabel">
            <DsfrBadge
                :label="attachmentsLabel"
                type="info"
                class="mt-1 lg:place-self-end text-xs py-2"
            />
        </div>
    </header>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";

import { useUserStore } from "@/stores/user.store";
import useLastUpdated from "@/composables/useLastUpdated";
import BadgeSiteOjectifResorption from "@/composables/BadgeSiteOjectifResorption.vue";
import getStatusBadgeType from "@/utils/getStatusBadgeType";

const props = defineProps({
    shantytown: {
        type: Object,
        required: true,
    },
    isHover: {
        type: Boolean,
        default: false,
    },
});
const { shantytown } = toRefs(props);
const { townStatus } = useLastUpdated(shantytown);

const userStore = useUserStore();

const heatwaveStatus = computed(() => {
    return shantytown.value.heatwaveStatus;
});
const attachmentsLabel = computed(() => {
    const commentsAttachments = shantytown.value.comments.reduce(
        (sum, comment) => {
            return sum + (comment.attachments ? comment.attachments.length : 0);
        },
        0
    );

    const justiceAttachments = userStore.hasLocalizedPermission(
        "shantytown_justice.access",
        shantytown
    )
        ? shantytown.value.attachments?.length
        : 0;

    const totalAttachments = commentsAttachments + justiceAttachments;

    return totalAttachments > 1
        ? `${totalAttachments} Documents partagés`
        : totalAttachments === 0
        ? null
        : `${totalAttachments} Document partagé`;
});

const badgeType = computed(() => {
    if (
        shantytown.value.closedAt &&
        shantytown.value.closedWithSolutions !== "yes"
    ) {
        return "error";
    } else if (
        shantytown.value.closedAt &&
        shantytown.value.closedWithSolutions === "yes"
    ) {
        return "success";
    }
    return getStatusBadgeType(
        shantytown.value.updatedAt,
        shantytown.value.lastUpdatedAt
    );
});
</script>
