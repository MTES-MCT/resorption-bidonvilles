import { axios } from "@/helpers/axios";

export function getActionsFinancesdReaders(managers) {
    return axios.post(`/action-finances-readers`, managers);
}
