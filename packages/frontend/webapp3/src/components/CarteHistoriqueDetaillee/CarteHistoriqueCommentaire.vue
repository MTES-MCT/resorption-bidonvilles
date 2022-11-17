<template>
    <div>
        <div>
            <TagCommentaireCovid
                v-for="tag in covidTags"
                :key="tag.prop"
                :class="['mr-2', 'mb-2']"
                :tag="tag"
            />
            <TagCommentaireStandard
                v-for="(tag, index) in standardTags"
                :key="index"
                class="px-3 mr-2 mb-2 text-sm"
                :tag="tag"
            />
        </div>
        <div
            class="mb-2"
            v-if="
                activity.comment &&
                (activity.comment.user_target_name.length > 0 ||
                    activity.comment.organization_target_name.length > 0)
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
        <p>
            <span class="font-bold">Message :</span>
            {{ description }}
        </p>
    </div>
</template>

<script setup>
import { Icon } from "@resorptionbidonvilles/ui";
import TagCommentaireStandard from "@/components/TagCommentaireStandard/TagCommentaireStandard.vue";
import TagCommentaireCovid from "@/components/TagCommentaireCovid/TagCommentaireCovid.vue";
import covidTag from "./covidTags";

import { defineProps, toRefs, computed } from "vue";

const props = defineProps({
    activity: {
        type: Object,
    },
});
const { activity } = toRefs(props);

const description = computed(() => {
    return activity.value.highCovidComment
        ? activity.value.highCovidComment.description
        : activity.value.comment.description;
});

const covidTags = computed(() => {
    if (!activity.value.comment || !activity.value.comment.covid) {
        return [];
    }

    return covidTag.filter((t) => {
        return !!activity.value.comment.covid[t.prop];
    });
});

const standardTags = computed(() => {
    if (!activity.value.comment) {
        return [];
    }
    return activity.value.comment.tags;
});
</script>
