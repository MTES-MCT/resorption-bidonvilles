<template>
    <section
        class="rounded border-1 border-blue300 px-4 pb-4 cursor-pointer hover:bg-blue200 flex flex-col relative"
        :to="`/question/${question.id}`"
    >
        <div class="absolute right-4 bg-secondary text-white px-2">
            <div
                class="text-sm font-bold"
                v-if="question.peopleAffected && question.peopleAffected > 0"
            >
                <Icon icon="exclamation-circle" />
                {{ question.peopleAffected }}
                {{
                    question.peopleAffected > 1
                        ? "habitants concernés"
                        : "habitant concerné"
                }}
            </div>
        </div>
        <CarteQuestionQuestion :question="question.question" />
        <section class="flex-1">
            <div class="text-primary font-bold mb-3">
                Par
                <LinkOrganization
                    :to="`/structure/${question.createdBy.organization_id}`"
                >
                    {{ question.createdBy.first_name }}
                    {{ question.createdBy.last_name }} -
                    {{ question.createdBy.organization }}
                </LinkOrganization>
            </div>
            <div>
                <QuestionTag
                    v-for="tag in question.tags"
                    :key="tag.uid"
                    :tag="tag"
                >
                    {{ tag.name }}
                </QuestionTag>
            </div>
        </section>
        <CarteQuestionFooter :question="question" />
    </section>
</template>

<script setup>
import { toRefs } from "vue";

import CarteQuestionQuestion from "./CarteQuestionQuestion.vue";
import CarteQuestionFooter from "./CarteQuestionFooter.vue";
import QuestionTag from "@/components/QuestionTag/QuestionTag.vue";
import { Icon, LinkOrganization } from "@resorptionbidonvilles/ui";

const props = defineProps({
    question: {
        type: Object,
        required: true,
    },
});
const { question } = toRefs(props);
</script>
