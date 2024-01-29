<template>
    <div>
        <TagCommentaire
            v-for="(tag, index) in tags"
            :key="index"
            class="px-3 mr-2 mb-2 text-sm"
            :tag="tag"
        />

        <div
            class="mb-2"
            v-if="
                activity.comment?.user_target_name.length > 0 ||
                activity.comment?.organization_target_name.length > 0
            "
        >
            <Icon icon="lock" class="text-red" />
            <span class="pl-1 font-bold"
                >Message réservé aux structures et utilisateurs suivants :</span
            >
            <div v-for="user in activity.comment.user_target_name" :key="user">
                - {{ user }}
            </div>
            <div
                v-for="organization in activity.comment
                    .organization_target_name"
                :key="organization"
            >
                - {{ organization }}
            </div>
        </div>
        <p class="whitespace-pre-line break-words">
            <span class="font-bold">Message :</span><br />
            {{ activity.comment.description }}
        </p>
    </div>
</template>

<script setup>
import { Icon } from "@resorptionbidonvilles/ui";
import TagCommentaire from "@/components/TagCommentaire/TagCommentaire.vue";

import { defineProps, toRefs, computed } from "vue";

const props = defineProps({
    activity: {
        type: Object,
    },
});
const { activity } = toRefs(props);

const tags = computed(() => {
    if (!activity.value.comment) {
        return [];
    }
    return activity.value.comment.tags;
});
</script>
