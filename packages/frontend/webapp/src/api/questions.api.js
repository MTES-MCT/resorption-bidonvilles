import { axios } from "@/helpers/axios";

export function addAnswer(questionId, answer, attachments) {
    const formData = new FormData();
    formData.append("content", JSON.stringify(answer));

    if (attachments?.length) {
        for (let i = 0; i < attachments.length; i += 1) {
            formData.append("attachments", attachments[i]);
        }
    }

    return axios.post(`/questions/${encodeURI(questionId)}/answers`, formData, {
        headers: {
            "Content-Type": "multipart/form-data; charset=utf-8",
        },
    });
}

export function createQuestion(question, attachments) {
    const formData = new FormData();
    formData.append("content", JSON.stringify(question));

    if (attachments?.length) {
        for (let i = 0; i < attachments.length; i += 1) {
            formData.append("attachments", attachments[i]);
        }
    }

    return axios.post(`/questions`, formData, {
        headers: {
            "Content-Type": "multipart/form-data; charset=utf-8",
        },
    });
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
