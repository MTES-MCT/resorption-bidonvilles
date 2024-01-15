<template>
    <ViewHeader icon="comments" direction="col">
        <template v-slot:title>{{ question.question }}</template>
        <template v-slot:description>
            Question posée par
            <LinkOrganization :to="`/structure/${author.organization_id}`">
                {{ author.first_name }}
                {{ author.last_name }} - {{ author.organization }}
            </LinkOrganization>
            <template v-if="question.peopleAffected">
                —
                <span class="text-sm font-bold text-secondary">
                    <Icon icon="exclamation-circle" />
                    {{ question.peopleAffected }}
                    {{
                        question.peopleAffected > 1
                            ? "habitants concernés"
                            : "habitant concerné"
                    }}
                </span>
            </template>
        </template>
        <template v-slot:actions>
            <div class="flex justify-between items-start">
                <div>
                    <FicheQuestionTags
                        :question="question"
                        v-if="question.tags.length > 0"
                        class="mb-4"
                    />
                </div>
                <div class="flex gap-2">
                    <FicheQuestionDeleteButton :question="question" size="sm" />

                    <FicheQuestionSubscriptionButton
                        :question="question"
                        size="sm"
                    />
                </div>
            </div>
        </template>
    </ViewHeader>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import { Icon, LinkOrganization } from "@resorptionbidonvilles/ui";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import FicheQuestionTags from "../FicheQuestionTags/FicheQuestionTags.vue";
import FicheQuestionSubscriptionButton from "../FicheQuestionSubscriptionButton/FicheQuestionSubscriptionButton.vue";
import FicheQuestionDeleteButton from "../FicheQuestionDeleteButton/FicheQuestionDeleteButton.vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
const author = question.value.createdBy;
</script>
