<template>
    <div
        class="container rounded border-1 border-blue300 px-4 pb-4 cursor-pointer hover:bg-blue200 flex flex-col"
        @click="routeToDetailedQuestion"
    >
        <div class="content">
            <CarteQuestionQuestion :question="question.question" />
            <CarteQuestionAuteurOrganisation :auteur="question.createdBy" />

            <p class="whitespace-pre-line mt-4">
                <template v-if="showAll">{{ question.details }}</template>
                <template v-else>
                    {{ question.details.substr(0, 300) }} [...]<br /><br />
                    <Link withStyle @click="showAll = true"
                        >[...] Lire la suite</Link
                    >
                </template>
            </p>
            <main class="mb-4"></main>
            <CarteQuestionFooter :question="question" />
        </div>
    </div>
</template>

<script setup>
import { toRefs, ref } from "vue";
import router from "@/helpers/router";

import CarteQuestionQuestion from "./CarteQuestionQuestion.vue";
import CarteQuestionAuteurOrganisation from "./CarteQuestionAuteurOrganisation.vue";
import CarteQuestionFooter from "./CarteQuestionFooter.vue";
import { Link } from "@resorptionbidonvilles/ui";

const props = defineProps({
    question: {
        type: Object,
        required: true,
    },
});
const { question } = toRefs(props);
const showAll = ref(question.value.details.length < 300);

function routeToDetailedQuestion() {
    router.push(`/communaute/${question.value.id}`);
}
</script>
