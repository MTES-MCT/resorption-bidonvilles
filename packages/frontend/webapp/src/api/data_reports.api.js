import { axios } from "@/helpers/axios";

export function exportTownsReport(from, to) {
    return axios.get(
        `/data-reports/towns?from=${encodeURIComponent(
            from.toISOString().slice(0, 10)
        )}&to=${encodeURIComponent(to.toISOString().slice(0, 10))}`,
        { responseType: "blob" }
    );
}
