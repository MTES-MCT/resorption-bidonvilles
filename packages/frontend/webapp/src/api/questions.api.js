import { axios } from "@/helpers/axios";

export function createQuestion(question) {
    return axios.post(`/questions/`, question);
}
