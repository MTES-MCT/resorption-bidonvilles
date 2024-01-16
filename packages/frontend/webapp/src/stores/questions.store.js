import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";
import { useEventBus } from "@common/helpers/event-bus";
import { useNotificationStore } from "@/stores/notification.store";
import {
    getQuestions,
    fetch,
    addAnswer,
    createQuestion,
} from "@/api/questions.api";
import { deleteAttachment } from "@/api/attachments_api.js";
import { subscribe, unsubscribe } from "@/api/questions.api";
import { useConfigStore } from "./config.store";
import filterQuestions from "@/utils/filterQuestions";
import sortList from "@/components/Entraide/ListeDesQuestions.sort";

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

    function reset() {
        questions.value = [];
        hash.value = {};
        subscriptions.value = {};
        isLoading.value = false;
        error.value = null;
        sort.value = "last_activity";
        resetPagination();
        resetFilters();
    }

    const { bus } = useEventBus();
    watch(() => bus.value.get("new-user"), reset);
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

    async function deleteQuestionAttachment(questionId, attachmentId) {
        const notificationStore = useNotificationStore();

        const question = hash.value[questionId];

        try {
            // Suppression de la pj de la bdd et du bucket S3
            await deleteAttachment(attachmentId);
        } catch (error) {
            notificationStore.error(
                "Suppression d'une pièce jointe",
                "Une erreur est survenue lors de la suppression de la pièce jointe"
            );
        }

        question.attachments = question.attachments.filter(
            (attachment) => attachment.id !== attachmentId
        );

        // trackEvent("Site", "Suppression attchment question", `S${questionId}`);
        notificationStore.success(
            "Suppression d'une pièce jointe",
            "La pièce jointe a bien été supprimée"
        );
    }

    async function deleteAnswerAttachment(questionId, answerId, attachmentId) {
        const notificationStore = useNotificationStore();
        const answers = hash.value[questionId].answers;

        try {
            // Suppression de la pj de la bdd et du bucket S3
            await deleteAttachment(attachmentId);
        } catch (error) {
            notificationStore.error(
                "Suppression d'une pièce jointe",
                "Une erreur est survenue lors de la suppression de la pièce jointe"
            );
        }

        const answer = answers.find((answer) => answer.id === answerId);

        answer.attachments = answer.attachments.filter(
            (attachment) => attachment.id !== attachmentId
        );
        // trackEvent("Site", "Suppression attchment answer", `S${questionId}`);
        notificationStore.success(
            "Suppression d'une pièce jointe",
            "La pièce jointe a bien été supprimée"
        );
    }
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
        createAnswer,
        deleteQuestionAttachment,
        deleteAnswerAttachment,
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
    };
});
