import { axios } from "@/helpers/axios";

export function getQuestions() {
    return axios.get("/questions");
}

export function fetch(id) {
    return axios.get(`questions/${id}`);
}

export function createQuestion(question) {
    return axios.post(`/questions`, question);
}

export function addAnswer(questionId, answer) {
    return axios.post(`/questions/${encodeURI(questionId)}/answers`, answer);
}
