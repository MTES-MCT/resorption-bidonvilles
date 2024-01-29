import { axios } from "@/helpers/axios";

export function exportList() {
    return axios.get("/shantytown-comments/export/csv");
}
