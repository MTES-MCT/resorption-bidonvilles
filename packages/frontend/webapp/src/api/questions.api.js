import { axios } from "@/helpers/axios";

export function list() {
    return axios.get("/questions");
}

export function fetch(id) {
    return axios.get(`questions/${id}`);
}

export function createQuestion(question) {
    return axios.post(`/questions`, question);
}
