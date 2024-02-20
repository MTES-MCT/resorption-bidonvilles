import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";
import { useEventBus } from "@common/helpers/event-bus";
import { useNotificationStore } from "@/stores/notification.store";
import {
    getQuestions,
    fetch,
    addAnswer,
    createQuestion,
    updateQuestion,
    deleteAnswer,
    deleteQuestion,
} from "@/api/questions.api";
import { subscribe, unsubscribe } from "@/api/questions.api";
import { useConfigStore } from "./config.store";
import filterQuestions from "@/utils/filterQuestions";
import sortList from "@/components/Entraide/ListeDesQuestions.sort";
import { deleteAttachment } from "@/api/attachments.api";

const ITEMS_PER_PAGE = 5;

export const useQuestionsStore = defineStore("questions", () => {
    const questions = ref([]);
    const hash = ref({});
    const isLoading = ref(null);
    const error = ref(null);
    const subscriptions = ref({});
    const filters = ref({
        tags: {},
        search: "",
    });
    const sort = ref("last_activity");
    const pendingDeletions = ref({});

    const filteredQuestions = computed(() => {
        return filterQuestions(questions.value, {
            tags: filters.value.tags,
            search: filters.value.search,
        });
    });
    const sortedQuestions = computed(() => {
        return sortList
            .find((item) => item.value === sort.value)
            .sortFn(filteredQuestions.value);
    });

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
                sortedQuestions.value.length,
                currentPage.index.value * ITEMS_PER_PAGE
            );
        }),
        content: computed(() => {
            if (currentPage.index.value === -1) {
                return [];
            }

            return sortedQuestions.value.slice(
                (currentPage.index.value - 1) * ITEMS_PER_PAGE,
                currentPage.index.value * ITEMS_PER_PAGE
            );
        }),
    };
    watch(resetPagination);
    watch(resetPagination, { deep: true });

    async function create(data, attachments) {
        const configStore = useConfigStore();
        const newQuestion = await createQuestion(data, attachments);
        hash.value[newQuestion.id] = newQuestion;
        questions.value.unshift(newQuestion);
        configStore.setQuestionSubscription(newQuestion.id, true);
        return newQuestion;
    }

    async function createAnswer(questionId, answer, attachments) {
        const configStore = useConfigStore();
        const notificationStore = useNotificationStore();
        const { answer: newAnswer, subscribed } = await addAnswer(
            questionId,
            answer,
            attachments
        );
        if (hash.value[questionId]) {
            hash.value[questionId].answers.unshift(newAnswer);
        }

        if (subscribed === true) {
            configStore.setQuestionSubscription(questionId, true);
        }

        notificationStore.success(
            "Publication d'une réponse",
            "Votre réponse est bien enregistrée"
        );
    }

    async function edit(data, value, userId) {
        const updatedQuestion = await updateQuestion(data, value, userId);
        hash.value[updatedQuestion.id] = updatedQuestion;
        return updatedQuestion;
    }

    async function fetchQuestion(questionId) {
        if (!hash.value[questionId]) {
            hash.value[questionId] = await fetch(questionId);
        }
        return hash.value[questionId];
    }

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

    function reset() {
        questions.value = [];
        hash.value = {};
        subscriptions.value = {};
        isLoading.value = false;
        error.value = null;
        sort.value = "last_activity";
        pendingDeletions.value = {};
        resetPagination();
        resetFilters();
    }

    function resetFilters() {
        filters.value.tags = {};
        filters.value.search = "";
    }

    function resetPagination() {
        if (sortedQuestions.value.length === 0) {
            currentPage.index.value = -1;
        } else {
            currentPage.index.value = 1;
        }
    }

    const { bus } = useEventBus();
    watch(() => bus.value.get("new-user"), reset);
    reset();

    return {
        questions,
        filteredQuestions,
        sortedQuestions,
        isLoading,
        error,
        currentPage,
        filters,
        sort,
        numberOfPages: computed(() => {
            if (sortedQuestions.value.length === 0) {
                return 0;
            }

            return Math.ceil(sortedQuestions.value.length / ITEMS_PER_PAGE);
        }),
        total: computed(() => sortedQuestions.value.length),
        fetchQuestions,
        fetchQuestion,
        create,
        edit,
        createAnswer,
        pendingDeletions,
        async deleteAnswer(questionId, answerId, reason) {
            const response = await deleteAnswer(questionId, answerId, reason);
            if (hash.value[questionId] !== undefined) {
                const index = hash.value[questionId].answers.findIndex(
                    ({ id }) => id === answerId
                );
                if (index >= 0) {
                    hash.value[questionId].answers.splice(index, 1);
                }
            }

            return response;
        },
        async removeQuestion(questionId) {
            if (pendingDeletions.value[questionId] === true) {
                return;
            }

            try {
                pendingDeletions.value[questionId] = true;

                const response = await deleteQuestion(questionId);
                const index = questions.value.findIndex(
                    ({ id }) => id === questionId
                );
                if (index >= 0) {
                    questions.value.splice(index, 1);
                }
                pendingDeletions.value[questionId] = false;
                return response;
            } catch (error) {
                pendingDeletions.value[questionId] = false;
                throw error;
            }
        },
        subscriptions,
        async subscribe(questionId) {
            if (!subscriptions.value[questionId]) {
                subscriptions.value[questionId] = false;
            }

            if (subscriptions.value[questionId] === true) {
                return;
            }

            const notificationStore = useNotificationStore();
            subscriptions.value[questionId] = true;

            try {
                const configStore = useConfigStore();
                await subscribe(questionId);
                configStore.setQuestionSubscription(questionId, true);
                notificationStore.success(
                    "Abonnement à la question réussi",
                    "Vous recevrez une notification mail à chaque nouvelle réponse à cette question"
                );
            } catch (error) {
                notificationStore.error(
                    "Abonnement à la question échoué",
                    error?.user_message || "Une erreur inconnue est survenue"
                );
            }

            subscriptions.value[questionId] = false;
        },

        async unsubscribe(questionId) {
            if (!subscriptions.value[questionId]) {
                subscriptions.value[questionId] = false;
            }

            if (subscriptions.value[questionId] === true) {
                return;
            }

            const notificationStore = useNotificationStore();
            subscriptions.value[questionId] = true;

            try {
                const configStore = useConfigStore();
                await unsubscribe(questionId);
                configStore.setQuestionSubscription(questionId, false);
                notificationStore.success(
                    "Désabonnement de la question réussi",
                    "Vous ne recevrez plus de notifications mails pour cette question"
                );
            } catch (error) {
                notificationStore.error(
                    "Désabonnement de la question échoué",
                    error?.user_message || "Une erreur inconnue est survenue"
                );
            }

            subscriptions.value[questionId] = false;
        },

        async deleteQuestionAttachment(file, { questionId }) {
            await deleteAttachment(file.id);
            if (hash.value[questionId] === undefined) {
                return;
            }

            const fileIndex = hash.value[questionId].attachments.findIndex(
                ({ id }) => id === file.id
            );
            if (fileIndex === -1) {
                return;
            }

            hash.value[questionId].attachments.splice(fileIndex, 1);
        },

        async deleteAnswerAttachment(file, { questionId, answerId }) {
            await deleteAttachment(file.id);
            const answerIndex = hash.value[questionId].answers.findIndex(
                ({ id }) => id === answerId
            );

            if (answerIndex === -1) {
                return;
            }

            const fileIndex = hash.value[questionId].answers[
                answerIndex
            ].attachments.findIndex(({ id }) => id === file.id);
            if (fileIndex === -1) {
                return;
            }

            hash.value[questionId].answers[answerIndex].attachments.splice(
                fileIndex,
                1
            );
        },
    };
});
