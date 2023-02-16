<template>
    <RouterLink
        class="rounded border-1 border-blue300 px-4 pb-4 cursor-pointer hover:bg-blue200 flex flex-col"
        :to="`/question/${question.id}`"
    >
        <div class="content">
            <CarteQuestionQuestion :question="question.question" />
            <div class="flex justify-between">
                <div class="text-primary font-bold mb-1 mt-2">
                    <LinkOrganization
                        :to="`/structure/${question.createdBy.organization_id}`"
                    >
                        {{ question.createdBy.first_name }}
                        {{ question.createdBy.last_name }} -
                        {{ question.createdBy.organization }}
                    </LinkOrganization>
                </div>
                <div>
                    <Tag
                        variant="primary"
                        v-for="tag in question.tags"
                        :key="tag"
                    >
                        {{ tag }}
                    </Tag>
                </div>
            </div>
            <div
                class="text-sm font-bold"
                v-if="question.peopleAffected && question.peopleAffected > 0"
            >
                {{ question.peopleAffected }}
                {{
                    question.peopleAffected > 1
                        ? "habitants concernés"
                        : "habitant concerné"
                }}
            </div>
            <p class="whitespace-pre-line mt-4">
                {{
                    question.details
                        .substr(0, 300)
                        .split("\n")
                        .slice(0, 5)
                        .join("\n")
                }}
                <template v-if="showMore"
                    >[...]<br /><br />
                    <Link withStyle>[...] Lire la suite</Link>
                </template>
            </p>
            <CarteQuestionFooter :question="question" />
        </div>
    </RouterLink>
</template>

<script setup>
import { toRefs, computed } from "vue";

import { RouterLink } from "vue-router";
import CarteQuestionQuestion from "./CarteQuestionQuestion.vue";
import CarteQuestionFooter from "./CarteQuestionFooter.vue";
import { Link, Tag, LinkOrganization } from "@resorptionbidonvilles/ui";

const props = defineProps({
    question: {
        type: Object,
        required: true,
    },
});
const { question } = toRefs(props);

const showMore = computed(() => {
    return (
        question.value.details.length > 300 ||
        question.value.details.split("\n").length > 4
    );
});
</script>
