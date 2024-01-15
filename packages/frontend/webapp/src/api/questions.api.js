import { axios } from "@/helpers/axios";

export function addAnswer(questionId, answer) {
    return axios.post(`/questions/${encodeURI(questionId)}/answers`, answer);
}

export function createQuestion(question) {
    return axios.post(`/questions`, question);
}

export function deleteQuestion(questionId) {
    return axios.delete(`/questions/${encodeURI(questionId)}`);
}

export function fetch(id) {
    return axios.get(`questions/${id}`);
}

export function getQuestions() {
    return axios.get("/questions");
}

export function subscribe(questionId) {
    return axios.put(`/questions/${encodeURI(questionId)}/subscription`);
}

export function unsubscribe(questionId) {
    return axios.delete(`/questions/${encodeURI(questionId)}/subscription`);
}
