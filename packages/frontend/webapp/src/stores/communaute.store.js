import { defineStore } from "pinia";
import { ref } from "vue";
import { list, fetch } from "@/api/questions.api";

export const useCommunauteStore = defineStore("communaute", () => {
    const questions = ref([]);
    const hash = ref({});
    const isLoading = ref(null);
    const error = ref(null);

    async function fetchQuestions() {
        if (isLoading.value === true) {
            return;
        }

        isLoading.value = true;
        error.value = null;
        try {
            const questions = await list();
            questions.value = questions;
            hash.value = questions.value.reduce((hash, question) => {
                hash[question.id] = question;
                return hash;
            }, {});
        } catch (e) {
            error.value =
                e?.code ||
                e?.user_message ||
                "Une erreur inconnue est survenue";
        }

        isLoading.value = false;
    }

    async function fetchQuestion(questionId) {
        if (!hash.value[questionId]) {
            hash.value[questionId] = await fetch(questionId);
        }
        return hash.value[questionId];
    }

    return {
        questions,
        fetchQuestions,
        fetchQuestion,
    };
});
