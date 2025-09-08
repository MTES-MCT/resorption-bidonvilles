<template>
    <header class="px-6 flex flex-col lg:flex-row justify-between">
        <div class="flex-col sm:flex-row">
            <Tag
                :variant="pinVariant"
                :class="[
                    'text-xs uppercase',
                    isHover ? 'shadow-md' : '',
                    'lastUpdatedAtDotColor',
                ]"
                class="mt-1 items-center py-2 mr-2"
            >
                {{ formatLastUpdatedAt(townForLastUpdate) }}
            </Tag>
            <Tag
                v-if="heatwaveStatus === true"
            <BadgeSiteOjectifResorption
                :resorption-target="shantytown.resorptionTarget"
            />
        </div>
        <div class="flex right-14" v-if="attachmentsLabel">
            <Tag
                variant="highlight"
                :class="[
                    'text-xs lg:text-xs uppercase text-primary',
                    isHover ? 'shadow-md' : '',
                ]"
                class="mt-1 gap-2 lg:place-self-end items-center py-0"
            >
                <Icon icon="paperclip" class="text-sm lg:text-md" />
                {{ attachmentsLabel }}
            </Tag>
        </div>
    </header>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import getSince from "@/utils/getSince";
import formatLastUpdatedAt from "@/utils/formatLastUpdatedAt";

import { Tag, Icon } from "@resorptionbidonvilles/ui";
import ResorptionTargetTag from "@/components/TagObjectifResorption/TagObjectifResorption.vue";
import { useUserStore } from "@/stores/user.store";

import useLastUpdated from "@/composables/useLastUpdated";
import BadgeSiteOjectifResorption from "@/composables/BadgeSiteOjectifResorption.vue";
import getStatusBadgeType from "@/utils/getStatusBadgeType";

const props = defineProps({
    shantytown: Object,
    isHover: {
        type: Boolean,
        default: false,
    },
});
const { shantytown, isHover } = toRefs(props);

const { townForLastUpdate } = useLastUpdated(shantytown);

const userStore = useUserStore();

const pinVariant = computed(() => {
    const { months } = getSince(shantytown.value.lastUpdatedAt);

    if (months >= 6) {
        return "pin_red";
    } else if (months >= 3) {
        return "pin_orange";
    }
    return "pin_green";
});

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
</script>
