<template>
    <ViewHeader icon="comments" direction="col">
        <template v-slot:title>{{ question.question }}</template>
        <template v-slot:description>
            Question posée par
            <LinkOrganization :to="`/structure/${author.organization.id}`">
                {{ formatUserName(author) }}
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
            <div class="md:flex justify-between items-start gap-2">
                <FicheQuestionTags
                    :question="question"
                    v-if="question.tags.length > 0"
                    class="mb-4"
                />
                <div
                    class="flex flex-col shrink-0 sm:flex-row items-start gap-2"
                >
                    <FicheQuestionModificationButton
                        v-if="
                            userStore.user.is_superuser ||
                            author.id === userStore.user.id
                        "
                        :question="question"
                        size="sm"
                    />
                    <FicheQuestionDeleteButton
                        v-if="userStore.user.is_superuser"
                        :question="question"
                        size="sm"
                    />
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
import { computed, toRefs } from "vue";
import { useUserStore } from "@/stores/user.store";

import { Icon, LinkOrganization } from "@resorptionbidonvilles/ui";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import FicheQuestionTags from "../FicheQuestionTags/FicheQuestionTags.vue";
import FicheQuestionSubscriptionButton from "../FicheQuestionSubscriptionButton/FicheQuestionSubscriptionButton.vue";
import FicheQuestionDeleteButton from "../FicheQuestionDeleteButton/FicheQuestionDeleteButton.vue";
import FicheQuestionModificationButton from "../FicheQuestionModificationButton/FicheQuestionModificationButton.vue";
import formatUserName from "@/utils/formatUserName";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
const author = computed(() => {
    return question.value.createdBy;
});
const userStore = useUserStore();
</script>
