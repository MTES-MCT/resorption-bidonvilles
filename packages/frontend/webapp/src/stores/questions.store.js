import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";
import { useEventBus } from "@/helpers/event-bus";
import { getQuestions, fetch } from "@/api/questions.api";

const ITEMS_PER_PAGE = 5;

export const useQuestionsStore = defineStore("questions", () => {
    const questions = ref([]);
    const hash = ref({});
    const isLoading = ref(null);
    const error = ref(null);

    const currentPage = {
        index: ref(-1), // index = 1 pour la première page
        from: computed(() => {
            if (currentPage.index.value === -1) {
                return -1;
            }

            return (currentPage.index.value - 1) * ITEMS_PER_PAGE + 1;
        }),
        to: computed(() => {
            if (currentPage.index.value === -1) {
                return -1;
            }

            return Math.min(
                questions.value.length,
                currentPage.index.value * ITEMS_PER_PAGE
            );
        }),
        content: computed(() => {
            if (currentPage.index.value === -1) {
                return [];
            }

            return questions.value.slice(
                (currentPage.index.value - 1) * ITEMS_PER_PAGE,
                currentPage.index.value * ITEMS_PER_PAGE
            );
        }),
    };
    watch(resetPagination);
    watch(resetPagination, { deep: true });

    function resetPagination() {
        if (questions.value.length === 0) {
            currentPage.index.value = -1;
        } else {
            currentPage.index.value = 1;
        }
    }

    function reset() {
        questions.value = [];
        isLoading.value = false;
        error.value = null;
        resetPagination();
    }

    const { bus } = useEventBus();
    watch(() => bus.value.get("new-question"), reset);
    reset();

    async function fetchQuestions() {
        if (isLoading.value === true) {
            return;
        }

        isLoading.value = true;
        error.value = null;
        try {
            const rawQuestions = await getQuestions();
            questions.value = rawQuestions;
            hash.value = questions.value.reduce((hash, question) => {
                hash[question.id] = question;
                return hash;
            }, {});
            currentPage.index.value = rawQuestions.length > 0 ? 1 : -1;
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
        isLoading,
        error,
        currentPage,
        numberOfPages: computed(() => {
            if (questions.value.length === 0) {
                return 0;
            }

            return Math.ceil(questions.value.length / ITEMS_PER_PAGE);
        }),
        total: computed(() => questions.value.length),
        fetchQuestions,
        fetchQuestion,
    };
});
