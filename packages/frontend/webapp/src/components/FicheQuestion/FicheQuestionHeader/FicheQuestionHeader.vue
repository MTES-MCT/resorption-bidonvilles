<template>
    <ViewHeader icon="person-circle-question" direction="col">
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
    </ViewHeader>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import { Icon, LinkOrganization } from "@resorptionbidonvilles/ui";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
const author = question.value.createdBy;
</script>
