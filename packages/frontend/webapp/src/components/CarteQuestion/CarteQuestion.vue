<template>
    <router-link custom v-slot="{ navigate }" :to="`/question/${question.id}`">
        <div
            :aria-label="`Fiche question: ${question.question}`"
            role="button"
            tabindex="0"
            @click="navigate"
            class="rounded border-1 border-blue300 px-4 pb-4 cursor-pointer hover:bg-blue200 flex flex-col relative"
            :class="focusClasses.ring"
        >
            <div class="absolute right-4 text-secondary px-2">
                <div
                    tabindex="0"
                    class="text-sm font-bold"
                    v-if="
                        question.peopleAffected && question.peopleAffected > 0
                    "
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
            <CarteQuestionQuestion class="pt-4" :question="question.question" />
            <div class="text-primary font-bold mb-3">
                Par
                <LinkOrganization
                    :to="`/structure/${question.createdBy.organization.id}`"
                    :ariaLabel="`Afficher la fiche de la structure de l'auteur ${formatUserName(
                        question.createdBy
                    )}`"
                >
                    {{ formatUserName(question.createdBy) }}
                </LinkOrganization>
            </div>
            <div
                tabindex="0"
                aria-label="Liste des étiquettes caractérisant la question"
            >
                <QuestionTag
                    v-for="tag in question.tags"
                    :key="tag.uid"
                    :tag="tag"
                >
                    {{ tag.name }}
                </QuestionTag>
            </div>
            <CarteQuestionFooter :question="question" />
        </div>
    </router-link>
</template>

<script setup>
import { toRefs } from "vue";
import focusClasses from "@common/utils/focus_classes";

import CarteQuestionQuestion from "./CarteQuestionQuestion.vue";
import CarteQuestionFooter from "./CarteQuestionFooter.vue";
import QuestionTag from "@/components/QuestionTag/QuestionTag.vue";
import { Icon, LinkOrganization } from "@resorptionbidonvilles/ui";
import formatUserName from "@/utils/formatUserName";

const props = defineProps({
    question: {
        type: Object,
        required: true,
    },
});
const { question } = toRefs(props);
</script>
