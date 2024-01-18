import { axios } from "@/helpers/axios";

export function getActionsFinancesdReaders(data) {
    return axios.post(`/action-finances-readers`, data);
}
