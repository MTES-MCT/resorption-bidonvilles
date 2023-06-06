<template>
    <p class="mt-2">
        <Link :to="`/question/${activity.question.id}`">Question </Link>
        de :
        <LinkOrganization
            :to="`/structure/${activity.question_author.organization}`"
            >{{ activity.question_author.name }}</LinkOrganization
        >
    </p>

    <div class="whitespace-pre-line break-words mt-2">
        <p class="ml-4">{{ activity.question.question }}</p>
    </div>

    <p class="mt-2">
        <Link :to="`/question/${activity.question.id}#reponses`">Réponse </Link>
        de :
        <LinkOrganization
            :to="`/structure/${activity.answer_author.organization}`"
            >{{ activity.answer_author.name }}</LinkOrganization
        >
    </p>

    <div class="whitespace-pre-line break-words mt-2">
        <p class="ml-4">{{ activity.answer.description }}</p>
    </div>
</template>

<script setup>
import { toRefs } from "vue";

import { LinkOrganization, Link } from "@resorptionbidonvilles/ui";

const props = defineProps({
    activity: {
        type: Object,
    },
});
const { activity } = toRefs(props);
</script>
