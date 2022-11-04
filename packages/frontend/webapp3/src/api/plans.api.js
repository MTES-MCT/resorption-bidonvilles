import { axios } from "@/helpers/axios";

export function fetchList() {
    return axios.get("/plans");
}

export function exportComments() {
    return axios.get("/plans/comments/export");
}

export function exportPlans() {
    return axios.get("/plans/export");
}
