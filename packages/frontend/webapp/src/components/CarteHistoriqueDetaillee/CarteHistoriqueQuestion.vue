<template>
    <div>
        <QuestionTag
            v-for="(tag, index) in tags"
            :key="index"
            class="px-3 mr-2 text-sm"
            :tag="tag"
        />
        <div
            class="text-sm font-bold text-secondary"
            v-if="
                activity.question.people_affected &&
                activity.question.people_affected > 0
            "
        >
            <Icon icon="exclamation-circle" />
            {{ activity.question.people_affected }}
            {{
                activity.question.people_affected > 1
                    ? "habitants concernés"
                    : "habitant concerné"
            }}
        </div>

        <p class="whitespace-pre-line break-words">
            <span class="font-bold">Question :</span><br />
            {{ activity.question.question }}
        </p>
    </div>
</template>

<script setup>
import { toRefs, computed } from "vue";

import { Icon } from "@resorptionbidonvilles/ui";
import QuestionTag from "../QuestionTag/QuestionTag.vue";

const props = defineProps({
    activity: {
        type: Object,
    },
});
const { activity } = toRefs(props);

const tags = computed(() => {
    if (!activity.value.question) {
        return [];
    }
    return activity.value.question.tags;
});
</script>
