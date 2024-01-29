import { axios } from "@/helpers/axios";

export function getActionFinanceReaders(departement, managers) {
    return axios.get(
        `/action-finance-readers/departement/${encodeURI(
            departement
        )}?managers=${encodeURIComponent(managers.join(","))}`
    );
}
